package core

import (
	"time"
	"github.com/samuel/go-zookeeper/zk"
	"fmt"
	"encoding/base64"
	"regexp"
	"errors"
	"log"
	"strings"
)

var PATTERN_ZKURL = regexp.MustCompile("^([a-zA-Z0-9._-]+(:[1-9][0-9]+)?)(,[a-zA-Z0-9._-]+(:[1-9][0-9]+)?)*(/\\w+)?$")
var PATTERN_FORMAT = regexp.MustCompile("//+")
var PATH_SPLIT = "/"

type zkService struct {
	conn *zk.Conn
	root string
}

func (p *zkService) getFullPath(path string) string {
	s := PATTERN_FORMAT.ReplaceAllString(fmt.Sprintf("/%s/%s", p.root, path), PATH_SPLIT)
	return strings.TrimRight(s, PATH_SPLIT)
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
func (p *zkService) Create(name string, data []byte) (error) {
	path := p.getFullPath(name)
	_, err := p.conn.Create(path, data, 0, zk.WorldACL(zk.PermAll))
	return err
}

func (p *zkService) Update(name string, data []byte) (error) {
	path := p.getFullPath(name)
	_, err := p.conn.Set(path, data, -1)
	return err
}

func (p *zkService) Del(name string) (error) {
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

func NewZkService(zkurl string) (ZkService, error) {
	if !PATTERN_ZKURL.MatchString(zkurl) {
		return nil, errors.New(fmt.Sprintf("invalid zkurl %s", zkurl))
	}
	var seeds []string
	var root string
	if i := strings.LastIndex(zkurl, "/"); i < 0 {
		root = PATH_SPLIT
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
