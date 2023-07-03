const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;
const pool = require('./database/todoModel')
const server = new grpc.Server();
const todos = [];

// CREATE 
/* 
Function takes in 2 arguments: 
  1. Object - It's the entire call request. On the whole call object, there is a request property that contains the data sent from the client in an object format that is defined in the proto file. We have defined it as a `TodoItem` object that has two properties an id and a text property. We want the text property. And we get that and insert it into our database. 
  2. Callback function - Is the function defined by the CLIENT. THe client is making a request to the server, provids a callback function as it's 2nd argument in case there's an error. The server will run that function if there's an error.
*/
async function createTodo(call, callback) {
  const todoText = call.request.text;
  try {
    const result =  pool.query('INSERT into todos (text) VALUES ($1) RETURNING *', [todoText])
    const insertedTodoItem = result.rows[0];
    callback(null, insertedTodoItem);

  } catch (error) {
    callback(error);
  }
  // /todos.push(todoItem);
  // callback(null, todoItem);
}

async function readTodos(call, callback) {
  try {
    const result = await pool.query('SELECT * FROM todos');
    const todoItems = result.rows;
    callback(null, { items: todoItems });
    // return result 
  } catch (error) {
    console.log("Error: ", error)
  }
}


// READ 
function readTodosStream(call) {
  todos.forEach(t => call.write(t));
  call.end();
}

// Add the services to the server
// async function readTodos(call, callback) {
//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.execute('SELECT * FROM todos');
//     connection.release();
    
//     callback(null, { "items": rows });
//   } catch (error) {
//     callback(error);
//   }
// }
server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodosStream: readTodosStream
});

server.bindAsync('0.0.0.0:3300', grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error('Failed to bind:', error);
    return;
  }
  console.log('Server bound on port:', port);
  server.start();
});
