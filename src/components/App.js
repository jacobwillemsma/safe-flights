import React, { useState } from "react";

import planeData from "../utils/delta-data";

const App = () => {
  const [flightNumber, setFlightNumber] = useState("");
  const [aircraft, setAircraft] = useState([]);

  const flightNumberChanged = event => setFlightNumber(event.target.value);

  const flightNumberSubmitted = async event => {
    event.preventDefault();

    const newAircraft = await getAirplaneTypes(flightNumber);
    console.log(newAircraft);
    setAircraft(newAircraft);
  };

  const seperateAirlineCode = flightNumber => {
    const airlineCode = flightNumber
      .split("")
      .filter(flightChar => !"0123456789".includes(flightChar))
      .join("");
    const airlineFlightNumber = flightNumber
      .split("")
      .filter(flightChar => "0123456789".includes(flightChar))
      .join("");

    return [airlineCode, airlineFlightNumber];
  };

  const getAirplaneTypes = async flightNumber => {
    const [airlineCode, airlineFlightNumber] = seperateAirlineCode(
      flightNumber
    );

    console.log(airlineCode, airlineFlightNumber);

    const url = `https://aviation-edge.com/v2/public/routes?key=8367a9-fc2bdc&airlineIata=${airlineCode}&flightNumber=${airlineFlightNumber}`;

    const resp = await fetch(url)
    const json = await resp.json()

    const routePlanes = json[0].regNumber

    const hydratedPlanes = planeData.filter((plane) => routePlanes.includes(plane.numberRegistration))
    return hydratedPlanes;
  };

  return (
    <div>
      <div>
        <div>
          <p>
            Enter your flight number to find out what type of plane you will
            be flying on, and how safe it is.
            </p>
          <form onSubmit={flightNumberSubmitted}>
            <input
              type="text"
              placeholder="AC1"
              value={flightNumber}
              onChange={flightNumberChanged}
            />
            <button type="submit">Submit Flight Number</button>
          </form>
        </div>

        <p>number of aircraft: {aircraft.length}</p>

        {aircraft.map(plane => (
          <details key={plane.airplaneId}>
            <summary>{plane.numberRegistration}</summary>
            <p>{plane.airplaneIataType}</p>
            <p>{plane.planeAge}</p>
            <p>{plane.firstFlight}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default App;
