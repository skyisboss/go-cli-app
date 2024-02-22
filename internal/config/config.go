package config

import (
	"io"
	"sort"
	"strings"
	"sync"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/olekukonko/tablewriter"
	"github.com/samber/lo"
	"github.com/skyisboss/cli/internal/logs"
	util "github.com/skyisboss/cli/internal/utils"
)

type Config struct {
	GitCommit  string
	GitVersion string

	Env    string      `yaml:"env" env:"APP_ENV" env-default:"production" env-description:"Environment [production, local, sandbox]"`
	Debug  bool        `yaml:"debug" env:"APP_DEBUG" env-default:"false" env-description:"Enables debug mode"`
	Logger logs.Config `yaml:"logger"`
	Port   string      `yaml:"port" env:"PORT" env-default:"" env-description:"Enables http port"`
	AppKey int32       `yaml:"appkey" env:"APP_KEY" env-default:"" env-description:"Enables app key"`
	// Account string      `yaml:"account" env:"ACCOUNT" env-default:"" env-description:"Enables telegram apphash"`
	// Session string      `yaml:"session" env:"SESSION" env-default:"" env-description:"Enables telegram account session"`
}

var once = sync.Once{}
var cfg = &Config{}
var errCfg error

func New(gitCommit, gitVersion, configPath string, skipConfig bool) (*Config, error) {
	once.Do(func() {
		cfg = &Config{
			GitCommit:  gitCommit,
			GitVersion: gitVersion,
		}

		if skipConfig {
			errCfg = cleanenv.ReadEnv(cfg)
			return
		}

		errCfg = cleanenv.ReadConfig(configPath, cfg)
	})

	return cfg, errCfg
}

func PrintUsage(w io.Writer) error {
	desc, err := cleanenv.GetDescription(&Config{}, nil)
	if err != nil {
		return err
	}

	const delimiter = "||"

	// 1 line == 1 env var
	desc = strings.ReplaceAll(desc, "\n    \t", delimiter)

	lines := strings.Split(desc, "\n")

	// remove header
	lines = lines[1:]

	// hide internal vars
	lines = util.FilterSlice(lines, func(line string) bool {
		return !strings.Contains(strings.ToLower(line), "internal variable")
	})

	// remove duplicates
	lines = lo.Uniq(lines)

	// sort a-z (skip header)
	sort.Strings(lines[1:])

	// write as a table
	t := tablewriter.NewWriter(w)
	t.SetBorder(false)
	t.SetAutoWrapText(false)
	t.SetHeader([]string{"ENV", "Description"})
	t.SetHeaderAlignment(tablewriter.ALIGN_LEFT)

	for _, line := range lines {
		cells := strings.Split(line, delimiter)
		cells = util.MapSlice(cells, strings.TrimSpace)
		t.Append(cells)
	}

	t.Render()

	return nil
}
