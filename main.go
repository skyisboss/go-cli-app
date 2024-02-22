package main

import (
	"github.com/skyisboss/cli/cmd"
)

var (
	gitCommit  string
	gitVersion string
)

func main() {
	cmd.Version = gitVersion
	cmd.Commit = gitCommit
	cmd.Execute()
}
