import { useEffect, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import io from "socket.io-client";
import ClientsList from "./components/clientsList";

function App() {
  const [receivedData, setReceivedData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [connectedClients, setConnectedClients] = useState([]);
  const [ socketId, setSocketId ] = useState("");

  const handleDraw = (data) => {
    if (socket) {
      socket.emit("draw", data);
    }
  };

  const handleColorChange = (color) => {
    if (socket) {
      socket.emit("colorSelect", color);
    }
  };

  useEffect(() => {
    //This is a must, starting the socket connection out of a useEffect will create multiple connection
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);
    newSocket.on("connect", () => {
      setSocketId(newSocket.id);
    });
    newSocket.connect();
    //New client gets all the data on the canvas
    newSocket.on("drawingData", (data) => {
      setReceivedData(data);
    });

    //clientlist coming form the server
    newSocket.on("clientList", (clients) => {
      setConnectedClients(clients);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("draw", (data) => {
        // Handle the drawing data received from the server
        setReceivedData((prevData) => [...prevData, data]);
      });

      const onDisconnect = () => {
        console.log("disconnected");
      };

      return () => {
        socket.off("draw", onDisconnect);
        socket.disconnect();
      };
    }
  }, [socket]);

  return (
    <div className="app">
      <main className="main_content">
        <div>
          <h1>Pixel Art Collaboration</h1>
          <p>
          your are: {socketId.split("", 3)}

            </p>
          <div className="canvas_container">
           
            <Canvas
              onDraw={handleDraw}
              receivedData={receivedData}
              onSelectColor={handleColorChange}
            />
          </div>
        </div>
        <div className="connected_users">
          <h3>Connected Clients: {connectedClients.length}</h3>
          {connectedClients && (
            <ClientsList connectedClients={connectedClients} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
