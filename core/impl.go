package core

import (
	"encoding/base64"
	"errors"
	"fmt"
	"log"
	"regexp"
	"strings"
	"time"

	"net"

	"bufio"

	"github.com/samuel/go-zookeeper/zk"
)

var patternZkUrl = regexp.MustCompile("^([a-zA-Z0-9._\\-]+(:[1-9][0-9]+)?)(,[a-zA-Z0-9._\\-]+(:[1-9][0-9]+)?)*(/.+)?$")
var patternFormat = regexp.MustCompile("//+")
var pathSplit = "/"
var patternStat = regexp.MustCompile("^([a-zA-Z0-9_]+)\\s+(.+)$")

type zkService struct {
	conn *zk.Conn
	root string
}

func (p *zkService) getFullPath(path string) string {
	s := patternFormat.ReplaceAllString(fmt.Sprintf("/%s/%s", p.root, path), pathSplit)
	if s == pathSplit {
		return s
	} else {
		return strings.TrimRight(s, pathSplit)
	}
}

func (p *zkService) List(name string) ([]string, error) {
	path := p.getFullPath(name)
	if ch, _, err := p.conn.Children(path); err == nil {
		return ch, nil
	} else {
		return nil, err
	}
}
func (p *zkService) Get(name string) (*Node, error) {
	path := p.getFullPath(name)
	if bs, stat, err := p.conn.Get(path); err == nil {
		node := Node{}
		node.Data = base64.StdEncoding.EncodeToString(bs)
		node.NumChildren = stat.NumChildren
		return &node, nil
	} else {
		return nil, err
	}
}
func (p *zkService) Create(name string, data []byte) error {
	path := p.getFullPath(name)
	_, err := p.conn.Create(path, data, 0, zk.WorldACL(zk.PermAll))
	return err
}

func (p *zkService) Update(name string, data []byte) error {
	path := p.getFullPath(name)
	_, err := p.conn.Set(path, data, -1)
	return err
}

func (p *zkService) Del(name string) error {
	path := p.getFullPath(name)
	return p.conn.Delete(path, -1)
}

func (p *zkService) Exists(name string) (bool, error) {
	path := p.getFullPath(name)
	if has, _, err := p.conn.Exists(path); err == nil {
		return has, nil
	} else {
		return false, err
	}
}

func (p *zkService) Stats() (ZkStats, error) {
	c, err := net.Dial("tcp", p.conn.Server())
	defer c.Close()
	if err != nil {
		return nil, err
	} else if _, err := c.Write([]byte("mntr")); err != nil {
		return nil, err
	} else {
		red := bufio.NewReader(c)
		m := make(map[string]string, 0)
		for {
			if bs, _, err := red.ReadLine(); err == nil {
				match := patternStat.FindSubmatch(bs)
				if len(match) > 2 {
					m[string(match[1])] = string(match[2])
				}
			} else {
				break
			}
		}
		return m, nil
	}
}

func (p *zkService) GetConf() (ZkConf, error) {
	c, err := net.Dial("tcp", p.conn.Server())
	defer c.Close()
	if err != nil {
		return nil, err
	} else if _, err := c.Write([]byte("conf")); err != nil {
		return nil, err
	} else {
		red := bufio.NewReader(c)
		m := make(map[string]string, 0)
		for {
			bs, _, err := red.ReadLine()
			if err != nil {
				break
			}
			sp := strings.SplitN(string(bs), "=", 2)
			if len(sp) == 2 {
				m[sp[0]] = sp[1]
			}
		}
		return m, nil
	}
}

func NewZkService(zkurl string) (ZkService, error) {
	if !patternZkUrl.MatchString(zkurl) {
		return nil, errors.New(fmt.Sprintf("invalid zkurl %s", zkurl))
	}
	var seeds []string
	var root string
	if i := strings.Index(zkurl, "/"); i < 0 {
		root = pathSplit
		seeds = strings.SplitN(zkurl, ",", -1)
	} else {
		root = zkurl[i:]
		seeds = strings.SplitN(zkurl[:i], ",", -1)
	}
	seeds2 := make([]string, 0)
	for _, v := range seeds {
		if strings.Index(v, ":") < 0 {
			seeds2 = append(seeds2, fmt.Sprintf("%s:2181", v))
		} else {
			seeds2 = append(seeds2, v)
		}
	}

	conn, _, err := zk.Connect(seeds2, time.Second*30)
	if err != nil {
		return nil, err
	}
	log.Printf("connect zookeeper: zk://%s\n", zkurl)
	return &zkService{conn: conn, root: root}, nil
}
