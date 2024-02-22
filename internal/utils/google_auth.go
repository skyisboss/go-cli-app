package utils

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base32"
	"encoding/binary"
	"fmt"
	"net/url"
	"strings"
	"time"
)

type GoogleAuth struct {
}

func NewGoogleAuth() *GoogleAuth {
	return &GoogleAuth{}
}

func (_this *GoogleAuth) un() int64 {
	return time.Now().UnixNano() / 1000 / 30
}

func (_this *GoogleAuth) hmacSha1(key, data []byte) []byte {
	h := hmac.New(sha1.New, key)
	if total := len(data); total > 0 {
		h.Write(data)
	}
	return h.Sum(nil)
}

func (_this *GoogleAuth) base32encode(src []byte) string {
	return base32.StdEncoding.EncodeToString(src)
}

func (_this *GoogleAuth) base32decode(s string) ([]byte, error) {
	return base32.StdEncoding.DecodeString(s)
}

func (_this *GoogleAuth) toBytes(value int64) []byte {
	var result []byte
	mask := int64(0xFF)
	shifts := [8]uint16{56, 48, 40, 32, 24, 16, 8, 0}
	for _, shift := range shifts {
		result = append(result, byte((value>>shift)&mask))
	}
	return result
}

func (_this *GoogleAuth) toUint32(bts []byte) uint32 {
	return (uint32(bts[0]) << 24) + (uint32(bts[1]) << 16) +
		(uint32(bts[2]) << 8) + uint32(bts[3])
}

func (_this *GoogleAuth) oneTimePassword(key []byte, data []byte) uint32 {
	hash := _this.hmacSha1(key, data)
	offset := hash[len(hash)-1] & 0x0F
	hashParts := hash[offset : offset+4]
	hashParts[0] = hashParts[0] & 0x7F
	number := _this.toUint32(hashParts)
	return number % 1000000
}

// 获取秘钥
func (_this *GoogleAuth) GetSecret() string {
	var buf bytes.Buffer
	binary.Write(&buf, binary.BigEndian, _this.un())
	return strings.ToUpper(_this.base32encode(_this.hmacSha1(buf.Bytes(), nil)))
}

// 获取动态码
func (_this *GoogleAuth) GetCode(secret string) (string, error) {
	secretUpper := strings.ToUpper(secret)
	secretKey, err := _this.base32decode(secretUpper)
	if err != nil {
		return "", err
	}
	number := _this.oneTimePassword(secretKey, _this.toBytes(time.Now().Unix()/30))
	return fmt.Sprintf("%06d", number), nil
}

// 获取动态码二维码内容
func (_this *GoogleAuth) GetQrcode(user, secret string) string {
	// otpauth://totp/风控管理平台:web_nimo?secret=IS4GJUVQEGUUYBWI4LCUYJGJ5UO6IVPG&issuer=风控管理平台
	// return fmt.Sprintf("otpauth://totp/%s?secret=%s", user, secret)
	return fmt.Sprintf("otpauth://totp/电报管家系统:%s?secret=%s&issuer=电报管家系统", user, secret)
}

// 获取动态码二维码图片地址,这里是第三方二维码api
func (_this *GoogleAuth) GetQrcodeUrl(user, secret string) string {
	qrcode := _this.GetQrcode(user, secret)
	data := url.Values{}
	data.Set("data", qrcode)
	// return "https://api.qrserver.com/v1/create-qr-code/?" + data.Encode() + "&size=" + width + "x" + height + "&ecc=M"
	return "https://chart.googleapis.com/chart?cht=qr&chs=380&chl=" + qrcode
}

// 验证动态码
func (_this *GoogleAuth) VerifyCode(code, secret string) (bool, error) {
	_code, err := _this.GetCode(secret)
	fmt.Println(_code, code, err)
	if err != nil {
		return false, err
	}
	return _code == code, nil
}

var err error

func main() {

	fmt.Println("-----------------开启二次认证----------------------")
	user := "testxxx@qq.com"
	secret, code := InitAuth(user)
	fmt.Println(secret, code)

	fmt.Println("-----------------信息校验----------------------")

	// secret最好持久化保存在
	// 验证,动态码(从谷歌验证器获取或者freeotp获取)
	bool, err := NewGoogleAuth().VerifyCode(secret, code)
	if bool {
		fmt.Println("√")
	} else {
		fmt.Println("X", err)
	}
}

// 开启二次认证
func InitAuth(user string) (secret, qrCodeUrl string) {
	// 秘钥
	secret = NewGoogleAuth().GetSecret()
	fmt.Println("Secret:", secret)

	// 动态码(每隔30s会动态生成一个6位数的数字)
	code, err := NewGoogleAuth().GetCode(secret)
	fmt.Println("Code:", code, err)

	// 用户名
	qrCode := NewGoogleAuth().GetQrcode(user, code)
	fmt.Println("Qrcode", qrCode)

	// 打印二维码地址
	qrCodeUrl = NewGoogleAuth().GetQrcodeUrl(user, secret)
	fmt.Println("QrcodeUrl", qrCodeUrl)

	return
}
