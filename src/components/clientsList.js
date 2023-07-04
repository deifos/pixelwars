import React from "react";


const ClientsList = ({connectedClients}) => {
    
  return (
    <ul>
      {connectedClients.map((client, index) => (
        <li key={index}>
          <span
            className="bullet"
            style={{ backgroundColor: client.color }}
          ></span>
          {client.id.split("", 3)} -{" "}
          <span style={{ backgroundColor: client.color }}>
            {" "}
            {client.color}{" "}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ClientsList;
