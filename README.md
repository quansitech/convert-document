## convert-document

```text
文档格式转换服务

支持将多个word文档转为一个pdf文档功能
```

#### 安装
```php
docker-compose up -d convert-document
```

#### 用法

服务默认采用3000端口

docker间的访问可以直接采用 http://convert-document:3000 地址访问

```shell
curl -v -k -d "paths=/var/www/xxx/app/1.docx&out_put=/var/www/xxx/app/2.pdf"  http://convert-document:3000/
```

请求参数说明

| 字段     | 说明                                        | 格式     |
|:-------|:------------------------------------------|:-------|
| paths | word文档地址，多个使用英文逗号拼接（文件需要映射到容器里）          | string |
| out_put | 保存的pdf文档地址                                | string |


返回值说明

| 字段     | 说明                                        | 格式     |
|:-------|:------------------------------------------|:-------|
| code | 状态码，0 成功 -1 失败          | int |
| msg | 处理结果信息                                | string |

```js
// 成功
{code:0,msg:"success"}

// 失败
{code:-1,msg:"file not found"}

```
