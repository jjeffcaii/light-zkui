package main

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io/ioutil"
	"light-zkui/core"
	"os"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

const (
	DATA_TYPE_STRING int8   = 0
	DATA_TYPE_BINARY int8   = 1
	API_VERSION      string = "v1"
)

type ErrResp struct {
	Message string `json:"message"`
}

type PostNode struct {
	Data string `json:"data"`
	Type int8   `json:"type"`
}

func (p *PostNode) extract() ([]byte, error) {
	switch p.Type {
	case DATA_TYPE_BINARY:
		return base64.StdEncoding.DecodeString(p.Data)
	case DATA_TYPE_STRING:
		return []byte(p.Data), nil
	default:
		return nil, errors.New(fmt.Sprintf("invalid data type %d", p.Type))
	}
}

func main() {
	zkurl := flag.String("zk", "", "zookeeper url. (eg: zk-1:2181,zk-2:2181,zk-3:2181/test)")
	listen := flag.String("listen", ":8080", "listen address. (default: 0.0.0.0:8080)")
	flag.Parse()
	zk, err := core.NewZkService(*zkurl)
	if err != nil {
		fmt.Println("error:", err.Error())
		os.Exit(1)
		return
	}
	app := echo.New()
	app.Use(middleware.Recover())
	app.Use(middleware.CORS())
	app.Static("/pages", "")

	app.GET(fmt.Sprintf("/%s/stats", API_VERSION), func(c echo.Context) error {
		if stats, err := zk.Stats(); err == nil {
			return c.JSON(200, stats)
		} else {
			return sendError(c, 500, err)
		}
	})

	app.GET(fmt.Sprintf("/%s/nodes/*", API_VERSION), func(c echo.Context) error {
		p := c.Param("*")
		switch c.QueryParam("ls") {
		case "true", "1", "yes":
			if node, err := zk.List("/" + p); err != nil {
				return sendError(c, 500, err)
			} else {
				return c.JSON(200, node)
			}
		default:
			if node, err := zk.Get("/" + p); err != nil {
				return sendError(c, 500, err)
			} else {
				return c.JSON(200, node)
			}
		}
	})

	app.POST(fmt.Sprintf("/%s/nodes/*", API_VERSION), func(c echo.Context) error {
		return handleWriteNode(c, 201, zk.Create)
	})

	app.PUT(fmt.Sprintf("/%s/nodes/*", API_VERSION), func(c echo.Context) error {
		return handleWriteNode(c, 200, zk.Update)
	})

	app.DELETE(fmt.Sprintf("/%s/nodes/*", API_VERSION), func(c echo.Context) error {
		p := c.Param("*")
		if err := zk.Del(p); err != nil {
			exists, err2 := zk.Exists(p)
			if err2 != nil {
				return sendError(c, 500, err2)
			} else if exists {
				return sendError(c, 500, err)
			}
		}
		return c.NoContent(204)
	})

	app.Start(*listen)
}

func sendError(c echo.Context, code int, err error) error {
	return c.JSON(code, ErrResp{Message: err.Error()})
}

func handleWriteNode(c echo.Context, code int, fn func(string, []byte) error) error {
	bs, err := ioutil.ReadAll(c.Request().Body)
	if err != nil {
		return sendError(c, 500, err)
	}
	vo := &PostNode{}
	if err := json.Unmarshal(bs, vo); err != nil {
		return sendError(c, 500, err)
	}
	data, err := vo.extract()
	if err != nil {
		return sendError(c, 500, err)
	}
	p := c.Param("*")
	if err := fn(p, data); err != nil {
		return sendError(c, 500, err)
	}
	return c.JSON(code, "ok")
}
