package utils

import (
	"bytes"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"reflect"
	"regexp"
	"runtime"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"golang.org/x/crypto/bcrypt"
)

func Print(v interface{}) {
	b, err := json.Marshal(v)
	if err != nil {
		fmt.Println(v)
		return
	}

	var out bytes.Buffer
	err = json.Indent(&out, b, "", "  ")
	if err != nil {
		fmt.Println(v)
		return
	}

	fmt.Println(out.String())
}

func StrToInt(data string) (int, error) {
	num, err := strconv.Atoi(data)
	if err != nil {
		return 0, err
	}
	return num, nil
}

func ToJson(v interface{}) string {
	b, err := json.Marshal(v)
	if err != nil {
		fmt.Println(v)
		return ""
	}

	var out bytes.Buffer
	err = json.Indent(&out, b, "", "  ")
	if err != nil {
		fmt.Println(v)
		return ""
	}

	return out.String()
}

func Response(msg string, err int, data interface{}) gin.H {
	if data == nil {
		data = gin.H{}
	}
	return gin.H{"err": err, "msg": msg, "data": data}
}

// 密码加密: pwdHash  同PHP函数 password_hash()
func PasswordHash(pwd string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(bytes), err
}

// 密码验证: pwdVerify  同PHP函数 password_verify()
func PasswordVerify(pwd, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(pwd))

	return err == nil
}

// 返回成功
func ShowSuccess(c *gin.Context, msg string, data gin.H) {
	res := gin.H{}
	if data != nil {
		res = data
	}
	c.JSON(http.StatusOK, gin.H{"err": 0, "msg": msg, "data": res})
	c.Abort()
}

// 返回失败
func ShowError(c *gin.Context, msg string, data gin.H) {
	res := gin.H{}
	if data != nil {
		res = data
	}
	c.JSON(http.StatusOK, gin.H{"err": 400, "msg": msg, "data": res})
	c.Abort()
}

// 查询x是否在arr数组中
func InArray[T comparable](arr []T, x T) bool {
	for _, v := range arr {
		if v == x {
			return true
		}
	}
	return false
}

func StrToInt64(value string) (int64, error) {
	res, err := strconv.ParseInt(value, 10, 64)
	return res, err
}
func Int64ToStr(value int64) string {
	res := strconv.FormatInt(value, 10)
	return res
}

// 写入文件
func Write2file(content string) {
	// 要追加写入的文件路径
	filePath := "example.txt"

	// 要追加写入的内容
	// content := "This is additional content."

	// 打开文件，如果文件不存在则创建，以读写追加的方式打开
	file, err := os.OpenFile(filePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	// 将内容追加写入文件
	_, err = file.WriteString(content + "\n")
	if err != nil {
		fmt.Println("Error appending to file:", err)
		return
	}

	fmt.Println("Content has been appended successfully.")
}

// ProcessErr go validator参数校验器自定义规则及提示
func ProcessErr(u interface{}, err error) string {
	if err == nil { //如果为nil 说明校验通过
		return ""
	}
	invalid, ok := err.(*validator.InvalidValidationError) //如果是输入参数无效，则直接返回输入参数错误
	if ok {
		return "输入参数错误：" + invalid.Error()
	}
	validationErrs := err.(validator.ValidationErrors) //断言是ValidationErrors
	for _, validationErr := range validationErrs {
		fieldName := validationErr.Field() //获取是哪个字段不符合格式
		typeOf := reflect.TypeOf(u)
		// 如果是指针，获取其属性
		if typeOf.Kind() == reflect.Ptr {
			typeOf = typeOf.Elem()
		}
		field, ok := typeOf.FieldByName(fieldName) //通过反射获取filed
		if ok {
			errorInfo := field.Tag.Get("err_msg") // 获取field对应的reg_error_info tag值
			return fieldName + ":" + errorInfo    // 返回错误
		} else {
			return "缺失err_msg"
		}
	}
	return ""
}

// 获取正在运行的函数名
func GetFuncName() string {
	pc := make([]uintptr, 1)
	runtime.Callers(2, pc)
	f := runtime.FuncForPC(pc[0])
	return f.Name()
}

// 判断是否电话号码
func IsClientNumber(phone string) bool {
	// 定义正则表达式
	regexPattern := `^\d+$`
	if strings.HasPrefix(phone, "+") {
		regexPattern = `^\+\d+$`
	}

	// 编译正则表达式
	regex := regexp.MustCompile(regexPattern)
	// 使用正则表达式进行匹配
	return regex.MatchString(phone)
}

func RemoveElements[T comparable](slice []T, indexes []int) []T {
	var newSlice []T
	for i, v := range slice {
		if !contains(indexes, i) {
			newSlice = append(newSlice, v)
		}
	}
	return newSlice
}

func contains(indexes []int, i int) bool {
	for _, v := range indexes {
		if v == i {
			return true
		}
	}
	return false
}

func MD5Hash(text string) string {
	// 创建一个 MD5 哈希对象
	hasher := md5.New()
	// 将字符串转换为字节数组并写入哈希对象
	hasher.Write([]byte(text))
	// 计算哈希值
	hashInBytes := hasher.Sum(nil)
	// 将哈希值转换为十六进制字符串
	hashString32 := hex.EncodeToString(hashInBytes)
	// 返回32位和16位的哈希值
	return hashString32[8:24]
}
