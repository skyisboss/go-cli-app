package ui

import (
	"embed"
	_ "embed"
	"io/fs"
)

//go:embed dist/*
var Dist embed.FS

func Files() fs.FS {
	sub, _ := fs.Sub(Dist, "dist/assets")

	return sub
}
