import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import connectLiveReload from 'connect-livereload'
import * as express from 'express'
import * as livereload from 'livereload'
import { join } from 'path'
import { AppModule } from './app.module'
import { DEFAULT_PORT } from './constants'
import { OpenApiService } from './open-api/services/open-api.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn']
  })

  const configService = app.get(ConfigService)

  app.setGlobalPrefix('api')
  app.use(express.urlencoded({ limit: '50mb', extended: true }))
  app.useGlobalPipes(new ValidationPipe())

  // Live reload.
  const isProduction: boolean = configService.get('NODE_ENV') === 'production'
  const isTest: boolean = configService.get('NODE_ENV') === 'test'

  // Reload the browser when server files change.
  if (!isProduction && !isTest) {
    const liveReloadServer = livereload.createServer()
    liveReloadServer.server.once('connection', () => {
      setTimeout(() => {
        liveReloadServer.refresh('/')
      }, 100)
    })
    app.use(connectLiveReload())
  }

  const adminPath: string = configService.get('paths').admin

  app.use(express.static(adminPath))

  // Redirect all requests to the client app index.
  app.use((req, res, next) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/storage')) {
      next()
    } else {
      res.sendFile(join(adminPath, 'index.html'))
    }
  })

  if (!isProduction) {
    const openApiService: OpenApiService = app.get(OpenApiService)

    SwaggerModule.setup('api', app, openApiService.generateOpenApiObject(), {
      customfavIcon: 'assets/images/open-api/favicon.ico',
      customSiteTitle: 'Manifest API Doc',

      customCss: `
        
.swagger-ui html {
  box-sizing: border-box;
  }
  
html {
  background: #ffffff;
}

.swagger-ui *, .swagger-ui :after, .swagger-ui :before {
  box-sizing: inherit
}

.swagger-ui {
  background: #ffffff;
}

.swagger-ui body {
  margin: 0;
  background: #ffffff;
}

.swagger-ui .wrapper {
  width: 100%;
  max-width: 1460px;
  margin: 0 auto;
  padding: 0 20px
}

.swagger-ui .opblock-tag-section {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  padding: 0;
  border: 1px solid #EAEAEF;
  margin-bottom:-1px;

}

.swagger-ui .opblock-tag {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 10px 26px 10px 20px;
  cursor: pointer;
  -webkit-transition: all .2s;
  transition: all .2s;
  border: 0;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center
}

.swagger-ui .opblock-tag:hover {
  background: rgba(57, 57, 60, .02)
}

.swagger-ui .opblock-tag {
  font-size: 21px;
  margin: 0;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui .opblock-tag.no-desc span {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1
}

.swagger-ui .opblock-tag svg {
  -webkit-transition: all .4s;
  transition: all .4s
}

.swagger-ui .opblock-tag small {
  font-size: 14px;
  font-weight: 400;
  padding: 0 10px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-family: Open Sans, sans-serif;
  color: #3b4151
}

.swagger-ui .parаmeter__type {
  font-size: 12px;
  padding: 5px 0;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #3b4151
}

.swagger-ui .view-line-link {
  position: relative;
  top: 3px;
  width: 20px;
  margin: 0 5px;
  cursor: pointer;
  -webkit-transition: all .5s;
  transition: all .5s
}

.swagger-ui .opblock {
  margin: 0 20px 15px;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow: none;
}

.swagger-ui .opblock.is-open .opblock-summary {
  border-bottom: 1px solid #000
}

.swagger-ui .opblock .opblock-section-header {
  padding: 8px 20px;
  background: hsla(0, 0%, 100%, .8);
  box-shadow: none;
}

.swagger-ui .opblock .opblock-section-header, .swagger-ui .opblock .opblock-section-header label {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center
}

.swagger-ui .opblock .opblock-section-header label {
  font-size: 12px;
  font-weight: 700;
  margin: 0;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui .opblock .opblock-section-header label span {
  padding: 0 10px 0 0
}

.swagger-ui .opblock .opblock-section-header h4 {
  font-size: 14px;
  margin: 0;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui .opblock .opblock-summary-method {
  font-size: 14px;
  font-weight: 700;
  min-width: 80px;
  padding: 6px 15px;
  text-align: center;
  border-radius: 3px;
  background: #000;
  text-shadow: 0 1px 0 rgba(0, 0, 0, .1);
  font-family: Titillium Web, sans-serif;
  color: #fff
}

.swagger-ui .opblock .opblock-summary-path, .swagger-ui .opblock .opblock-summary-path__deprecated {
  font-size: 16px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 0 10px;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #3b4151;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center
}

.swagger-ui .opblock .opblock-summary-path .view-line-link, .swagger-ui .opblock .opblock-summary-path__deprecated .view-line-link {
  position: relative;
  top: 2px;
  width: 0;
  margin: 0;
  cursor: pointer;
  -webkit-transition: all .5s;
  transition: all .5s
}

.swagger-ui .opblock .opblock-summary-path:hover .view-line-link, .swagger-ui .opblock .opblock-summary-path__deprecated:hover .view-line-link {
  width: 18px;
  margin: 0 5px
}

.swagger-ui .opblock .opblock-summary-path__deprecated {
  text-decoration: line-through
}

.swagger-ui .opblock .opblock-summary-description {
  font-size: 13px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-family: Open Sans, sans-serif;
  color: #3b4151
}

.swagger-ui .opblock .opblock-summary {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 5px;
  cursor: pointer;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center
}

.swagger-ui .opblock.opblock-post {
  border-color: #AD7A03;
  background: rgba(73, 204, 144, .1)
}

.swagger-ui .opblock.opblock-post .opblock-summary-method {
  background: #AD7A03
}

.swagger-ui .opblock.opblock-post .opblock-summary {
  border-color: #AD7A03
}

.swagger-ui .opblock.opblock-put {
  border-color: #0653B8;
  background: rgba(252, 161, 48, .1)
}

.swagger-ui .opblock.opblock-put .opblock-summary-method {
    background: transparent;
    color: #0653B8
}

.swagger-ui .opblock.opblock-put .opblock-summary {
  border-color: #0653B8
}

.swagger-ui .opblock.opblock-delete {
  border-color: #af0f03;
  background: rgba(249, 62, 62, .1)
}

.swagger-ui .opblock.opblock-delete .opblock-summary-method {
  background: #af0f03
}

.swagger-ui .opblock.opblock-delete .opblock-summary {
  border-color: #af0f03
}

.swagger-ui .opblock.opblock-get {
  border-color: #007F31;
  background: #007F31
}

.swagger-ui .opblock.opblock-get .opblock-summary-method {
  background: transparent;
  color: #0653B8
}

.swagger-ui .opblock.opblock-get .opblock-summary {
  border-color: #007F31
}

.swagger-ui .opblock.opblock-patch {
  border-color: #50e3c2;
  background: rgba(80, 227, 194, .1)
}

.swagger-ui .opblock.opblock-patch .opblock-summary-method {
  background: #50e3c2
}

.swagger-ui .opblock.opblock-patch .opblock-summary {
  border-color: #50e3c2
}
  .swagger-ui .opblock.opblock-put .tab-header .tab-item.active h4 span:after {
  background: #0653B8;
  }

  .swagger-ui .opblock.opblock-post .tab-header .tab-item.active h4 span:after {
  background: #AD7A03;
  }

.swagger-ui .opblock.opblock-delete .tab-header .tab-item.active h4 span:after {
background: #af0f03;
}


.swagger-ui .opblock.opblock-head {
  border-color: #9012fe;
  background: rgba(144, 18, 254, .1)
}

.swagger-ui .opblock.opblock-head .opblock-summary-method {
  background: #9012fe
}

.swagger-ui .opblock.opblock-head .opblock-summary {
  border-color: #9012fe
}

.swagger-ui .opblock.opblock-options {
  border-color: #0d5aa7;
  background: rgba(13, 90, 167, .1)
}

.swagger-ui .opblock.opblock-options .opblock-summary-method {
  background: #0d5aa7
}

.swagger-ui .opblock.opblock-options .opblock-summary {
  border-color: #0d5aa7
}

.swagger-ui .opblock.opblock-deprecated {
  opacity: .6;
  border-color: #ebebeb;
  background: hsla(0, 0%, 92%, .1)
}

.swagger-ui .opblock.opblock-deprecated .opblock-summary-method {
  background: #ebebeb
}

.swagger-ui .opblock.opblock-deprecated .opblock-summary {
  border-color: #ebebeb
}

.swagger-ui .tab {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin: 20px 0 10px;
  padding: 0;
  list-style: none
}

.swagger-ui .tab li {
  font-size: 12px;
  min-width: 100px;
  min-width: 90px;
  padding: 0;
  cursor: pointer;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui .tab li:first-of-type {
  position: relative;
  padding-left: 0
}

.swagger-ui .tab li:first-of-type:after {
  position: absolute;
  top: 0;
  right: 6px;
  width: 1px;
  height: 100%;
  content: "";
  background: rgba(0, 0, 0, .2)
}

.swagger-ui .tab li.active {
  font-weight: 700
}

.swagger-ui .opblock-description-wrapper, .swagger-ui .opblock-title_normal {
  padding: 15px 20px
}

.swagger-ui .opblock-description-wrapper, .swagger-ui .opblock-description-wrapper h4, .swagger-ui .opblock-title_normal, .swagger-ui .opblock-title_normal h4 {
  font-size: 12px;
  margin: 0 0 5px;
  font-family: Open Sans, sans-serif;
  color: #3b4151
}

.swagger-ui .opblock-description-wrapper p, .swagger-ui .opblock-title_normal p {
  font-size: 14px;
  margin: 0;
  font-family: Open Sans, sans-serif;
  color: #3b4151
}

.swagger-ui .execute-wrapper {
  padding: 20px;
  text-align: right
}

.swagger-ui .execute-wrapper .btn {
  width: 100%;
  padding: 8px 40px
}

.swagger-ui .body-param-options {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column
}

.swagger-ui .body-param-options .body-param-edit {
  padding: 10px 0
}

.swagger-ui .body-param-options label {
  padding: 8px 0
}

.swagger-ui .body-param-options label select {
  margin: 3px 0 0
}

.swagger-ui .responses-inner {
  padding: 20px
}

.swagger-ui .responses-inner h4, .swagger-ui .responses-inner h5 {
  font-size: 12px;
  margin: 10px 0 5px;
  font-family: Open Sans, sans-serif;
  color: #3b4151
}

.swagger-ui .response-col_status {
  font-size: 14px;
  font-family: Open Sans, sans-serif;
  color: #3b4151
}

.swagger-ui .response-col_status .response-undocumented {
  font-size: 11px;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #999
}

.swagger-ui .response-col_description__inner span {
  font-size: 12px;
  font-style: italic;
  display: block;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  background: #41444e;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #fff
}

.swagger-ui .response-col_description__inner span p {
  margin: 0
}

.swagger-ui .opblock-body pre {
  font-size: 12px;
  margin: 0;
  padding: 10px;
  white-space: pre-wrap;
  border-radius: 4px;
  background: #41444e;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #fff
}

.swagger-ui .opblock-body pre span {
  color: #fff!important
}

.swagger-ui .scheme-container {
  margin: 0 0 20px;
  padding: 0;
  box-shadow: none;
}

.swagger-ui .scheme-container .schemes {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center
}

.swagger-ui .scheme-container .schemes>label {
  font-size: 12px;
  font-weight: 700;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  margin: -20px 15px 0 0;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui .scheme-container .schemes>label select {
  min-width: 130px;
  text-transform: uppercase
}

.swagger-ui .loading-container {
  padding: 40px 0 60px
}

.swagger-ui .loading-container .loading {
  position: relative
}

.swagger-ui .loading-container .loading:after {
  font-size: 10px;
  font-weight: 700;
  position: absolute;
  top: 50%;
  left: 50%;
  content: "loading";
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-transform: uppercase;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui .loading-container .loading:before {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 60px;
  height: 60px;
  margin: -30px;
  content: "";
  -webkit-animation: rotation 1s infinite linear, opacity .5s;
  animation: rotation 1s infinite linear, opacity .5s;
  opacity: 1;
  border: 2px solid rgba(85, 85, 85, .1);
  border-top-color: rgba(0, 0, 0, .6);
  border-radius: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden
}

@-webkit-keyframes rotation {
  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn)
  }
}

@keyframes rotation {
  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn)
  }
}

@-webkit-keyframes blinker {
  50% {
    opacity: 0
  }
}

@keyframes blinker {
  50% {
    opacity: 0
  }
}

.swagger-ui .btn {
  font-size: 14px;
  font-weight: 700;
  padding: 5px 23px;
  -webkit-transition: all .3s;
  transition: all .3s;
  border: 2px solid #888;
  border-radius: 4px;
  background: transparent;
  box-shadow: none;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui .btn[disabled] {
  cursor: not-allowed;
  opacity: .3
}

.swagger-ui .btn:hover {
  box-shadow: none;
}

.swagger-ui .btn.cancel {
  border-color: #af0f03;
  font-family: Titillium Web, sans-serif;
  color: #af0f03
}

.swagger-ui .btn.authorize {
  line-height: 1;
  display: inline;
  color: #AD7A03;
  border-color: #AD7A03
}

.swagger-ui .btn.authorize span {
  float: left;
  padding: 4px 20px 0 0
}

.swagger-ui .btn.authorize svg {
  fill: #AD7A03
}

.swagger-ui .btn.execute {
  -webkit-animation: pulse 2s infinite;
  animation: pulse 2s infinite;
  color: #fff;
  border-color: #2430F0
}

@-webkit-keyframes pulse {
  0% {
    color: #fff;
    background: #2430F0;
    box-shadow: none;
  }
  70% {
    box-shadow: none;
  }
  to {
    color: #fff;
    background: #2430F0;
    box-shadow: none;
  }
}

@keyframes pulse {
  0% {
    color: #fff;
    background: #2430F0;
    box-shadow: none;
  }
  70% {
    box-shadow: none;
  }
  to {
    color: #fff;
    background: #2430F0;
    box-shadow: none;
  }
}

.swagger-ui .btn-group {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 30px
}

.swagger-ui .btn-group .btn {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1
}

.swagger-ui .btn-group .btn:first-child {
  border-radius: 4px 0 0 4px
}

.swagger-ui .btn-group .btn:last-child {
  border-radius: 0 4px 4px 0
}

.swagger-ui .authorization__btn {
  padding: 0 10px;
  border: none;
  background: none
}

.swagger-ui .authorization__btn.locked {
  opacity: 1
}

.swagger-ui .authorization__btn.unlocked {
  opacity: .4
}

.swagger-ui .expand-methods, .swagger-ui .expand-operation {
  border: none;
  background: none
}

.swagger-ui .expand-methods svg, .swagger-ui .expand-operation svg {
  width: 20px;
  height: 20px
}

.swagger-ui .expand-methods {
  padding: 0 10px
}

.swagger-ui .expand-methods:hover svg {
  fill: #444
}

.swagger-ui .expand-methods svg {
  -webkit-transition: all .3s;
  transition: all .3s;
  fill: #777
}

.swagger-ui button {
  cursor: pointer;
  outline: none
}

.swagger-ui select {
  font-size: 14px;
  font-weight: 700;
  padding: 5px 40px 5px 10px;
  border: 2px solid #41444e;
  border-radius: 4px;
  background: #f7f7f7 url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCI+ICAgIDxwYXRoIGQ9Ik0xMy40MTggNy44NTljLjI3MS0uMjY4LjcwOS0uMjY4Ljk3OCAwIC4yNy4yNjguMjcyLjcwMSAwIC45NjlsLTMuOTA4IDMuODNjLS4yNy4yNjgtLjcwNy4yNjgtLjk3OSAwbC0zLjkwOC0zLjgzYy0uMjctLjI2Ny0uMjctLjcwMSAwLS45NjkuMjcxLS4yNjguNzA5LS4yNjguOTc4IDBMMTAgMTFsMy40MTgtMy4xNDF6Ii8+PC9zdmc+) right 10px center no-repeat;
  background-size: 20px;
  box-shadow: none;
  font-family: Titillium Web, sans-serif;
  color: #3b4151;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none
}

.swagger-ui select[multiple] {
  margin: 5px 0;
  padding: 5px;
  background: #f7f7f7
}

.swagger-ui .opblock-body select {
  min-width: 230px
}

.swagger-ui label {
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 5px;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui input[type=email], .swagger-ui input[type=password], .swagger-ui input[type=search], .swagger-ui input[type=text] {
  min-width: 100px;
  margin: 5px 0;
  padding: 8px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff
}

.swagger-ui input[type=email].invalid, .swagger-ui input[type=password].invalid, .swagger-ui input[type=search].invalid, .swagger-ui input[type=text].invalid {
  -webkit-animation: shake .4s 1;
  animation: shake .4s 1;
  border-color: #af0f03;
  background: #feebeb
}

@-webkit-keyframes shake {
  10%, 90% {
    -webkit-transform: translate3d(-1px, 0, 0);
    transform: translate3d(-1px, 0, 0)
  }
  20%, 80% {
    -webkit-transform: translate3d(2px, 0, 0);
    transform: translate3d(2px, 0, 0)
  }
  30%, 50%, 70% {
    -webkit-transform: translate3d(-4px, 0, 0);
    transform: translate3d(-4px, 0, 0)
  }
  40%, 60% {
    -webkit-transform: translate3d(4px, 0, 0);
    transform: translate3d(4px, 0, 0)
  }
}

@keyframes shake {
  10%, 90% {
    -webkit-transform: translate3d(-1px, 0, 0);
    transform: translate3d(-1px, 0, 0)
  }
  20%, 80% {
    -webkit-transform: translate3d(2px, 0, 0);
    transform: translate3d(2px, 0, 0)
  }
  30%, 50%, 70% {
    -webkit-transform: translate3d(-4px, 0, 0);
    transform: translate3d(-4px, 0, 0)
  }
  40%, 60% {
    -webkit-transform: translate3d(4px, 0, 0);
    transform: translate3d(4px, 0, 0)
  }
}

.swagger-ui textarea {
  font-size: 12px;
  width: 100%;
  min-height: 280px;
  padding: 10px;
  border: none;
  border-radius: 4px;
  outline: none;
  background: hsla(0, 0%, 100%, .8);
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #3b4151
}

.swagger-ui textarea:focus {
  border: 2px solid #007F31
}

.swagger-ui textarea.curl {
  font-size: 12px;
  min-height: 100px;
  margin: 0;
  padding: 10px;
  resize: none;
  border-radius: 4px;
  background: #41444e;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #fff
}
  .swagger-ui .opblock.opblock-get .tab-header .tab-item.active h4 span:after {
    background: #007F31;
  }
  

  .swagger-ui .response-control-media-type__accept-message {
      color: #AD7A03
  }
      .swagger-ui .response-control-media-type--accept-controller select {
      border-color: #AD7A03}

  .swagger-ui .checkbox {
  padding: 5px 0 10px;
  -webkit-transition: opacity .5s;
  transition: opacity .5s;
  color: #333
}

.swagger-ui .checkbox label {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex
}

.swagger-ui .checkbox p {
  font-weight: 400!important;
  font-style: italic;
  margin: 0!important;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #3b4151
}

.swagger-ui .checkbox input[type=checkbox] {
  display: none
}

.swagger-ui .checkbox input[type=checkbox]+label>.item {
  position: relative;
  top: 3px;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 0 8px 0 0;
  padding: 5px;
  cursor: pointer;
  border-radius: 1px;
  background: #e8e8e8;
  box-shadow: none;
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none
}

.swagger-ui .checkbox input[type=checkbox]+label>.item:active {
  -webkit-transform: scale(.9);
  transform: scale(.9)
}

.swagger-ui .checkbox input[type=checkbox]:checked+label>.item {
  background: #e8e8e8 url("data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='8' viewBox='3 7 10 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%2341474E' fill-rule='evenodd' d='M6.333 15L3 11.667l1.333-1.334 2 2L11.667 7 13 8.333z'/%3E%3C/svg%3E") 50% no-repeat
}

.swagger-ui .dialog-ux {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0
}

.swagger-ui .dialog-ux .backdrop-ux {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, .8)
}

.swagger-ui .dialog-ux .modal-ux {
  position: absolute;
  z-index: 9999;
  top: 50%;
  left: 50%;
  width: 100%;
  min-width: 300px;
  max-width: 650px;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border: 1px solid #ebebeb;
  border-radius: 4px;
  background: #fff;
  box-shadow: none;
}

.swagger-ui .dialog-ux .modal-ux-content {
  overflow-y: auto;
  max-height: 540px;
  padding: 20px
}

.swagger-ui .dialog-ux .modal-ux-content p {
  font-size: 12px;
  margin: 0 0 5px;
  color: #41444e;
  font-family: Open Sans, sans-serif;
  color: #3b4151
}

.swagger-ui .dialog-ux .modal-ux-content h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 15px 0 0;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui .dialog-ux .modal-ux-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #ebebeb;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center
}

.swagger-ui .dialog-ux .modal-ux-header .close-modal {
  padding: 0 10px;
  border: none;
  background: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none
}

.swagger-ui .dialog-ux .modal-ux-header h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  padding: 0 20px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui .model {
  font-size: 12px;
  font-weight: 300;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #3b4151
}

.swagger-ui .model-toggle {
  font-size: 10px;
  position: relative;
  top: 6px;
  display: inline-block;
  margin: auto .3em;
  cursor: pointer;
  -webkit-transition: -webkit-transform .15s ease-in;
  transition: -webkit-transform .15s ease-in;
  transition: transform .15s ease-in;
  transition: transform .15s ease-in, -webkit-transform .15s ease-in;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%
}

.swagger-ui .model-toggle.collapsed {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg)
}

.swagger-ui .model-toggle:after {
  display: block;
  width: 20px;
  height: 20px;
  content: "";
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/%3E%3C/svg%3E") 50% no-repeat;
  background-size: 100%
}

.swagger-ui .model-jump-to-path {
  position: relative;
  cursor: pointer
}

.swagger-ui .model-jump-to-path .view-line-link {
  position: absolute;
  top: -.4em;
  cursor: pointer
}

.swagger-ui .model-title {
  position: relative
}

.swagger-ui .model-title:hover .model-hint {
  visibility: visible
}

.swagger-ui .model-hint {
  position: absolute;
  top: -1.8em;
  visibility: hidden;
  padding: .1em .5em;
  white-space: nowrap;
  color: #ebebeb;
  border-radius: 4px;
  background: rgba(0, 0, 0, .7)
}

.swagger-ui section.models {
  margin: 30px 0;
  border: 1px solid #EAEAEF;
  border-radius: 4px
}

.swagger-ui section.models.is-open {
  padding: 0 0 20px
}

.swagger-ui section.models.is-open h4 {
  margin: 0 0 5px;
  border-bottom: 1px solid #EAEAEF
}

.swagger-ui section.models.is-open h4 svg {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg)
}

.swagger-ui section.models h4 {
  font-size: 16px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin: 0;
  padding: 10px 20px 10px 10px;
  cursor: pointer;
  -webkit-transition: all .2s;
  transition: all .2s;
  font-family: Titillium Web, sans-serif;
  color: #777;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center
}

.swagger-ui section.models h4 svg {
  -webkit-transition: all .4s;
  transition: all .4s
}

.swagger-ui section.models h4 span {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1
}

.swagger-ui section.models h4:hover {
  57rg57a(60, 0, 0, .02)
}

.swagger-ui section.models h5 {
  font-size: 16px;
  margin: 0 0 10px;
  font-family: Titillium Web, sans-serif;
  color: #777
}

.swagger-ui section.models .model-jump-to-path {
  position: relative;
  top: 5px
}

.swagger-ui section.models .model-container {
  margin: 0 20px 15px;
  -webkit-transition: all .5s;
  transition: all .5s;
  border-radius: 4px;
  background: rgba(0, 0, 0, .05)
}

.swagger-ui section.models .model-container:hover {
  background: rgba(0, 0, 0, .07)
}

.swagger-ui section.models .model-container:first-of-type {
  margin: 20px
}

.swagger-ui section.models .model-container:last-of-type {
  margin: 0 20px
}

.swagger-ui section.models .model-box {
  background: none
}

.swagger-ui .model-box {
  padding: 10px;
  border-radius: 4px;
  background: rgba(0, 0, 0, .1)
}

.swagger-ui .model-box .model-jump-to-path {
  position: relative;
  top: 4px
}

.swagger-ui .model-title {
  font-size: 16px;
  font-family: Titillium Web, sans-serif;
  color: #555
}

.swagger-ui span>span.model, .swagger-ui span>span.model .brace-close {
  padding: 0 0 0 10px
}

.swagger-ui .prop-type {
  color: #2430F0
}

.swagger-ui .json-schema-2020-12__attribute--primary {
  color: #2430F0
}
.swagger-ui .json-schema-2020-12 {
  background: #F5F7F9;
}

.swagger-ui .prop-enum {
  display: block
}

.swagger-ui .prop-format {
  color: #999
}

.swagger-ui table {
  width: 100%;
  padding: 0 10px;
  border-collapse: collapse
}

.swagger-ui table.model tbody tr td {
  padding: 0;
  vertical-align: top
}

.swagger-ui table.model tbody tr td:first-of-type {
  width: 100px;
  padding: 0
}

.swagger-ui table.headers td {
  font-size: 12px;
  font-weight: 300;
  vertical-align: middle;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #3b4151
}

.swagger-ui table tbody tr td {
  padding: 10px 0 0;
  vertical-align: top
}

.swagger-ui table tbody tr td:first-of-type {
  width: 20%;
  padding: 10px 0
}

.swagger-ui table thead tr td, .swagger-ui table thead tr th {
  font-size: 12px;
  font-weight: 700;
  padding: 12px 0;
  text-align: left;
  border-bottom: 1px solid rgba(59, 65, 81, .2);
  font-family: Open Sans, sans-serif;
  color: #3b4151
}

.swagger-ui .parameters-col_description p {
  font-size: 14px;
  margin: 0;
  font-family: Open Sans, sans-serif;
  color: #3b4151
}

.swagger-ui .parameters-col_description input[type=text] {
  width: 100%;
  max-width: 340px
}

.swagger-ui .parameter__name {
  font-size: 16px;
  font-weight: 400;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui .parameter__name.required {
  font-weight: 700
}

.swagger-ui .parameter__name.required:after {
  font-size: 10px;
  position: relative;
  top: -6px;
  padding: 5px;
  content: "required";
  color: rgba(255, 0, 0, .6)
}

.swagger-ui .parameter__in {
  font-size: 12px;
  font-style: italic;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #888
}

.swagger-ui .table-container {
  padding: 20px
}

.swagger-ui .topbar {
  padding: 8px 30px;
  background-color: #007F31;
  display: none;
}
.swagger-ui .swagger-container  {
  margin-top: 0
}

.swagger-ui .topbar .topbar-wrapper {
  -ms-flex-align: center
}

.swagger-ui .topbar .topbar-wrapper, .swagger-ui .topbar a {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  align-items: center
}

.swagger-ui .topbar a {
  font-size: 1.5em;
  font-weight: 700;
  text-decoration: none;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-align: center;
  font-family: Titillium Web, sans-serif;
  color: #fff
}

.swagger-ui .topbar a span {
  margin: 0;
  padding: 0 10px
}

.swagger-ui .topbar .download-url-wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex
}

.swagger-ui .topbar .download-url-wrapper input[type=text] {
  min-width: 350px;
  margin: 0;
  border: 2px solid #547f00;
  border-radius: 4px 0 0 4px;
  outline: none
}

.swagger-ui .topbar .download-url-wrapper .download-url-button {
  font-size: 16px;
  font-weight: 700;
  padding: 4px 40px;
  border: none;
  border-radius: 0 4px 4px 0;
  background: #547f00;
  font-family: Titillium Web, sans-serif;
  color: #fff
}

.swagger-ui .info {
  margin: 50px 0
}

.swagger-ui .info hgroup.main {
  margin: 0 0 20px
}

.swagger-ui .info hgroup.main a {
  font-size: 12px
}

.swagger-ui .info p {
  font-size: 14px;
  font-family: Open Sans, sans-serif;
  color: #3b4151
}

.swagger-ui .info code {
  padding: 3px 5px;
  border-radius: 4px;
  background: rgba(0, 0, 0, .05);
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #9012fe
}

.swagger-ui .info a {
  font-size: 14px;
  -webkit-transition: all .4s;
  transition: all .4s;
  font-family: Open Sans, sans-serif;
  color: #007F31
}

.swagger-ui .info a:hover {
  color: #1f69c0
}

.swagger-ui .info>div {
  margin: 0 0 5px
}

.swagger-ui .info .base-url {
  font-size: 12px;
  font-weight: 300!important;
  margin: 0;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #3b4151
}

.swagger-ui .info .title {
  font-size: 36px;
  margin: 0;
  font-family: Open Sans, sans-serif;
  color: #3b4151
}

.swagger-ui .info .title small {
  font-size: 10px;
  position: relative;
  top: -5px;
  display: inline-block;
  margin: 0 0 0 5px;
  padding: 2px 4px;
  vertical-align: super;
  border-radius: 57px;
  background: #7d8492
}

.swagger-ui .info .title small pre {
  margin: 0;
  font-family: Titillium Web, sans-serif;
  color: #fff
}

.swagger-ui .auth-btn-wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 10px 0;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center
}

.swagger-ui .auth-wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end
}

.swagger-ui .auth-wrapper .authorize {
  padding-right: 20px
}

.swagger-ui .auth-container {
  margin: 0 0 10px;
  padding: 10px 20px;
  border-bottom: 1px solid #ebebeb
}

.swagger-ui .auth-container:last-of-type {
  margin: 0;
  padding: 10px 20px;
  border: 0
}

.swagger-ui .auth-container h4 {
  margin: 5px 0 15px!important
}

.swagger-ui .auth-container .wrapper {
  margin: 0;
  padding: 0
}

.swagger-ui .auth-container input[type=password], .swagger-ui .auth-container input[type=text] {
  min-width: 230px
}

.swagger-ui .auth-container .errors {
  font-size: 12px;
  padding: 10px;
  border-radius: 4px;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #3b4151
}

.swagger-ui .scopes h2 {
  font-size: 14px;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

.swagger-ui .scope-def {
  padding: 0 0 20px
}

.swagger-ui .errors-wrapper {
  margin: 20px;
  padding: 10px 20px;
  -webkit-animation: scaleUp .5s;
  animation: scaleUp .5s;
  border: 2px solid #af0f03;
  border-radius: 4px;
  background: rgba(249, 62, 62, .1)
}

.swagger-ui .errors-wrapper .error-wrapper {
  margin: 0 0 10px
}

.swagger-ui .errors-wrapper .errors h4 {
  font-size: 14px;
  margin: 0;
  font-family: Source Code Pro, monospace;
  font-weight: 600;
  color: #3b4151
}

.swagger-ui .errors-wrapper hgroup {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center
}

.swagger-ui .errors-wrapper hgroup h4 {
  font-size: 20px;
  margin: 0;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-family: Titillium Web, sans-serif;
  color: #3b4151
}

@-webkit-keyframes scaleUp {
  0% {
    -webkit-transform: scale(.8);
    transform: scale(.8);
    opacity: 0
  }
  to {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1
  }
}

@keyframes scaleUp {
  0% {
    -webkit-transform: scale(.8);
    transform: scale(.8);
    opacity: 0
  }
  to {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1
  }
}

.swagger-ui .Resizer.vertical.disabled {
  display: none
}

/*# sourceMappingURL=swagger-ui.css.map*/

/**
 * Swagger UI Theme Overrides
 *
 * Theme: Newspaper
 * Author: Mark Ostrander
 * Github: https://github.com/ostranme/swagger-ui-themes
 */

 .swagger-ui .opblock.opblock-post {
   border-color: #F2F2F6;
   background: #F5F7F9;
 }

 .swagger-ui .opblock.opblock-post .opblock-summary-method {
   background: transparent;
   color: #AD7A03;  
 }

 .swagger-ui .opblock.opblock-post .opblock-summary {
   border-color: #F2F2F6;
 }

 .swagger-ui .opblock.opblock-put {
   border-color: #F2F2F6;
   background: #F5F7F9;
 }

 .swagger-ui .opblock.opblock-put .opblock-summary-method {
   background: transparent;
   color: #0653B8
 }

 .swagger-ui .opblock.opblock-put .opblock-summary {
   border-color: #F2F2F6;
 }

 .swagger-ui .opblock.opblock-delete {
   border-color: #F2F2F6;
   background: #F5F7F9;
 }

 .swagger-ui .opblock.opblock-delete .opblock-summary-method {
   background: transparent;
   color: #af0f03
 }

 .swagger-ui .opblock.opblock-delete .opblock-summary {
   border-color: #F2F2F6;
 }

 .swagger-ui .opblock.opblock-get {
   border-color: #F2F2F6;
   background: #F5F7F9;
 }

 .swagger-ui .opblock.opblock-get .opblock-summary-method {
   background: transparent;
   color: #007F31;
 }

 .swagger-ui .opblock.opblock-get .opblock-summary {
   border-color: #F2F2F6;
 }

 .swagger-ui .opblock.opblock-patch {
   border-color: #F2F2F6;
   background: #F5F7F9;
 }

 .swagger-ui .opblock.opblock-patch .opblock-summary-method {
   background: transparent;
   color: #633497
 }

 .swagger-ui .opblock.opblock-patch .opblock-summary {
   border-color: #F2F2F6;
 }

 .swagger-ui .opblock.opblock-head {
   border-color: #F2F2F6;
   background: #F5F7F9;
 }

 .swagger-ui .opblock.opblock-head .opblock-summary-method {
   background: transparent;
   color: #007F31
 }

 .swagger-ui .opblock.opblock-head .opblock-summary {
   border-color: #F2F2F6;
 }

 .swagger-ui .opblock.opblock-options {
   border-color: #F2F2F6;
   background: #F5F7F9;
 }

 .swagger-ui .opblock.opblock-options .opblock-summary-method {
   background: transparent;
   color: #ce107c
 }

 .swagger-ui .opblock.opblock-options .opblock-summary {
   border-color: #F2F2F6;
 }

 .swagger-ui .topbar {
   padding: 8px 30px;
   background-color: #535356;
 }
 .swagger-ui .topbar .download-url-wrapper input[type=text] {
   min-width: 350px;
   margin: 0;
   border: 2px solid #F2F2F6;
   border-radius: 4px 0 0 4px;
   outline: none;
 }

 .swagger-ui .topbar .download-url-wrapper .download-url-button {
   font-size: 16px;
   font-weight: 700;
   padding: 4px 40px;
   border: none;
   border-radius: 0 4px 4px 0;
   background: #F2F2F6;
   font-family: Titillium Web, sans-serif;
   color: #535356;
 }

 .swagger-ui .info a {
   font-size: 14px;
   -webkit-transition: all .4s;
   transition: all .4s;
   font-family: Open Sans, sans-serif;
   color: #535356;
 }

 .swagger-ui .info a:hover {
   color: #535356;
 }

 .swagger-ui .btn.authorize {
   line-height: 1;
   display: inline;
   color: #535356;
   border-color: #535356;
 }
 .swagger-ui .btn.authorize svg {
   fill: #535356;
 }
`
    })
  }

  await app.listen(configService.get('PORT') || DEFAULT_PORT)
}
bootstrap()
