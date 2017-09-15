package core

type Node struct {
	Data        string `json:"data"`
	NumChildren int32  `json:"numChildren"`
}

type ZkService interface {
	List(name string) ([]string, error)
	Get(name string) (*Node, error)
	Create(name string, data []byte) error
	Update(name string, data []byte) error
	Del(name string) (error)
	Exists(name string) (bool, error)
}
