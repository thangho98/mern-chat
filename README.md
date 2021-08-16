<h1 align="center"> Mern Chat  </h1>
Realtime Chat App with MERN Stack and Socket.io | Skype Clone

## 💻 &nbsp; Setup

To run this project, install it locally using npm:

***
1. Clone repository.
  ```
  $ git clone https://github.com/thangho98/mern-chat.git
  ```
2. Install dependencies
-----
Go to each folder (client and server) and enter this to install dependencies
  ```
  $ npm install
  ```
3. Have a .env file in the server folder with the following data
-----
```
NODE_ENV=development
SOCKET_PORT=5001
HTTP_PORT=5002
MONGODB_URL='<mongo db url>'
CLOUDINARY_CLOUD_NAME='<cloudinary cloud name>'
CLOUDINARY_API_KEY='<cloudinary api key>'
CLOUDINARY_API_SECRET='<cloudinary secret key>'
```
4. Have a .env file in the client folder with the following data
-----
```
REACT_APP_BASE_API_URL=http://localhost:5002/api
```
5. Go to server folder and run in local development
-----
```
$ yarn dev
```
    
6. Go to client folder and run in local development
-----
```
$ yarn dev
```
7. Open your favourite browser and type
```
http://localhost:3000/
```
Happy and enjoy it :)
