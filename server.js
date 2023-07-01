const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
const todos = [];

function createTodo(call, callback) {
  const todoItem = {
    id: todos.length + 1,
    text: call.request.text
  };
  todos.push(todoItem);
  callback(null, todoItem);
}

function readTodosStream(call) {
  todos.forEach(t => call.write(t));
  call.end();
}

function readTodos(call, callback) {
  callback(null, { items: todos });
}

// Add the services to the server
server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodosStream: readTodosStream
});

server.bindAsync('0.0.0.0:40000', grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error('Failed to bind:', error);
    return;
  }
  console.log('Server bound on port:', port);
  server.start();
});