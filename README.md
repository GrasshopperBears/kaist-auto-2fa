# kaist-auto-2fa

Automatically paste 2FA code sent to your external email into clipboard.

## Server config (`/server`)

### Preparation

- You need your server
  - Server is using 2 ports
    - 25 for mail server
    - ${PORT} configured at `.env`
  - You should create user to receive mail
- Configure forwarding authentication mail from your external email(e.g. Gmail) to your server
- SSL configuration is necessary. If you are using Nginx, then you can refer `nginx.conf` ([reference](https://velog.io/@pinot/Ubuntu-Nginx-%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C-CertBot%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-https-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0))

### 1. Add `.env` configuration file (Example)

```
AUTHENTICATION_MAIL_FROM=iamps@kaist.ac.kr
AUTHENTICATION_MAIL_TITLE=KAIST 본인인증번호
PORT=3000
SERVER_HOST=example.com
CODE_ENDPOINT=/code
```

### 2. To start server

- Install node, npm to your server.
- Install pm2 through `npm i -g pm2`
- Then run `npm start`

---

## Extension config (`/extension`)

1. Load extension program at `chrome://extensions/`
2. Click added extension and enter URL of your server to request code. Then click set button.
3. When you click login, input box will change into black after the code is pasted into clipboard.
