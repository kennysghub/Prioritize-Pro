# grpc-todo
To-Do App with gRPC unary, client, server, and bi-directional streaming 

# Docker
Build the container image. 
```
docker build -t grpc-todo .
```

### Start an app container 
```
docker run -dp 127.0.0.1:40000:40000 grpc-todo
```