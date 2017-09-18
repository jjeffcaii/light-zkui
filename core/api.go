package core

type Node struct {
	Data        string `json:"data"`
	NumChildren int32  `json:"numChildren"`
}

type ZkStats = map[string]string
type ZkConf = map[string]string

type ZkService interface {
	List(name string) ([]string, error)
	Get(name string) (*Node, error)
	Create(name string, data []byte) error
	Update(name string, data []byte) error
	Del(name string) error
	Exists(name string) (bool, error)
	Stats() (ZkStats, error)
	GetConf() (ZkConf, error)
}
