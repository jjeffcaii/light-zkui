package core

import (
	"testing"
)

func TestName(t *testing.T) {
	if !patternZkUrl.MatchString("1.zk.las:2181,2.zk.las:2181,3.zk.las:2181/parrot-ng") {
		t.Fail()
	}

}
