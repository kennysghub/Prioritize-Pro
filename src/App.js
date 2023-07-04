import React, {useState} from 'react';
// import * as grpc from '@grpc/grpc-js';
// import * as protoLoader from '@grpc/proto-loader';
// const packageDef = protoLoader.loadSync('../todo.proto', {});
// const grpcObject = grpc.loadPackageDefinition(packageDef);
// const todoPackage = grpcObject.todoPackage;
// let text;
// const client = new todoPackage.Todo('localhost:3300', grpc.credentials.createInsecure() );
// const input = document.getElementById('input');
// const button = document.getElementById('submit');

// button.addEventListener('click', () => {
//     text = input;
// })
// console.log("CLIENT: ", client);
// client.createTodo({
//     "id": -1,
//     "text": text
// }, (err,response) => {
//     console.log("Received from server " + JSON.stringify(response))
// });


export default function App() {
    const [text, setText] = useState('');
    const handleClick = () => {
        console.log(text)
    };
    const handleChange = (e) => {
        setText(e.target.value);
        console.log(text)
    }
    return (
    <div>
        <h1>To-Do App</h1>
        <br></br>
        <input onChange={handleChange} />
        <br></br>
        <button onClick={handleClick}>Add to To-Do List</button>
    </div>
  )
}
