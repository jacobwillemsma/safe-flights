import React, { useState } from "react";

const App = () => {
  // Constants
  const AUTHED_URL =
    "https://aviation-edge.com/v2/public/routes?key=8367a9-fc2bdc";
  const PLANE_IMAGES = {
    b707:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Boeing_707-138B_Qantas_Jett_Clipper_Ella_N707JT.jpg/1920px-Boeing_707-138B_Qantas_Jett_Clipper_Ella_N707JT.jpg",
    b717:
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/Delta_Air_Lines_Boeing_717-2BD_N966AT.jpg",
    b737:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/WS_YYC_737_MAX_1.jpg/1920px-WS_YYC_737_MAX_1.jpg",
    b747:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Lufthansa_Boeing_747-8_%2816093562187%29.jpg/1920px-Lufthansa_Boeing_747-8_%2816093562187%29.jpg",
    b757:
      "https://upload.wikimedia.org/wikipedia/commons/2/22/Icelandair_Boeing_757-256_Wedelstaedt.jpg",
    b767:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Delta_Air_Lines_B767-332_N130DL.jpg/1920px-Delta_Air_Lines_B767-332_N130DL.jpg",
    b777:
      "https://upload.wikimedia.org/wikipedia/commons/0/07/United_Airlines_777_N797UA_LAX.jpg",
    b787:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Boeing_787_N1015B_ANA_Airlines_%2827611880663%29_%28cropped%29.jpg/1920px-Boeing_787_N1015B_ANA_Airlines_%2827611880663%29_%28cropped%29.jpg"
  };
  const PLANE_STATS = {
    b707: { incidents: 255, deaths: 3039, totalDelivered: 1010 },
    b717: { incidents: 5, deaths: 0, totalDelivered: 155 },
    b737: { incidents: 368, deaths: 4862, totalDelivered: 10510 },
    b747: { incidents: 146, deaths: 3722, totalDelivered: 1548 },
    b757: { incidents: 33, deaths: 574, totalDelivered: 1049 },
    b767: { incidents: 46, deaths: 854, totalDelivered: 1139 },
    b777: { incidents: 28, deaths: 541, totalDelivered: 1585 },
    b787: { incidents: 1, deaths: 0, totalDelivered: 800 }
  };

  // Hooks
  const [flightNumber, setFlightNumber] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const [aircraftInfo, setAircraftInfo] = useState(null);

  // Flight Number Handlers
  const flightNumberChanged = event => setFlightNumber(event.target.value);

  const flightNumberSubmitted = event => {
    console.log("Button pushed");
    event.preventDefault();
    setAirplaneType(flightNumber);
  };

  const newSearch = () => {
    setFlightNumber("");
    setRouteInfo(null);
    setAircraftInfo(null);
  };

  // Helpers
  const seperateAirlineCode = flightNumber => {
    // AC1 => [AC, 1]
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

  const setAirplaneType = async flightNumber => {
    const [airlineCode, airlineFlightNumber] = seperateAirlineCode(
      flightNumber
    );

    // Handle route(s).
    // TODO: Allow multiple flights under same schedule to be displayed.
    const routeUrl = `${AUTHED_URL}&airlineIata=${airlineCode}&flightNumber=${airlineFlightNumber}`;
    const routeResp = await fetch(routeUrl);
    const routeJson = await routeResp.json();

    const flight = routeJson[0];
    const newRouteInfo = {
      departureAirport: flight.departureIata,
      departureTime: flight.departureTime,
      arrivalAirport: flight.arrivalIata,
      arrivalTime: flight.arrivalTime
    };
    setRouteInfo(newRouteInfo);

    // Handle aircraft(s) on route.
    const routeTailNumbers = flight.regNumber;
    const sampleTailNumber =
      routeTailNumbers[Math.floor(Math.random() * routeTailNumbers.length)];

    const aircraftUrl = `https://aviation-edge.com/v2/public/airplaneDatabase?key=8367a9-fc2bdc&numberRegistration=${sampleTailNumber}`;
    const aircraftResp = await fetch(aircraftUrl);
    const aircraftJson = await aircraftResp.json();

    const newAircraft = aircraftJson[0];
    const newAircraftInfo = {
      aircraftType: newAircraft.airplaneIataType,
      aircraftModel: newAircraft.modelCode,
      firstFlight: newAircraft.firstFlight,
      planeAge: newAircraft.planeAge
    };
    setAircraftInfo(newAircraftInfo);
  };

  const getAircraftImage = aircraftName => {
    for (let key in PLANE_IMAGES) {
      if (aircraftName.toLocaleLowerCase().includes(key)) {
        return PLANE_IMAGES[key];
      }
    }
  };

  const getAircraftStats = aircraftName => {
    for (let key in PLANE_STATS) {
      if (aircraftName.toLocaleLowerCase().includes(key)) {
        const stats = PLANE_STATS[key];
        return (
          <div>
            <p>Number of planes delivered: {stats.totalDelivered}</p>
            <p>
              Percentage of shipped planes that have been involved in an
              incident: {stats.incidents / stats.totalDelivered}
            </p>
            <p>Total of deaths: {stats.deaths}</p>
          </div>
        );
      }
    }
  };

  if (flightNumber && routeInfo && aircraftInfo) {
    return (
      <div>
        <section className="hero has-text-centered">
          <div className="columns is-centered">
            <div className="column is-6">
              <h1 className="title">{flightNumber}</h1>
              <h2 className="subtitle">
                Traveling from {routeInfo.departureAirport} (take off:{" "}
                {routeInfo.departureTime}) to {routeInfo.arrivalAirport}{" "}
                (landing at: {routeInfo.arrivalTime})
              </h2>
              <h2 className="subtitle">
                Flying on a {aircraftInfo.aircraftType}.
              </h2>
              <img
                src={getAircraftImage(aircraftInfo.aircraftType)}
                alt={aircraftInfo.aircraftType}
              />
              {getAircraftStats(aircraftInfo.aircraftType)}
            </div>

            <p className="control column is-2">
              <button
                className="button is-success is-centered"
                onClick={newSearch}
              >
                Search another flight
              </button>
            </p>
          </div>
        </section>
        <footer className="footer">
          <div className="content has-text-centered">
            <p>
              <strong>Safe Flights</strong> by Jacob Willemsma
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div>
      <section className="hero has-text-centered">
        <div className="columns is-centered">
          <div className="column is-6">
            <h1 className="title">Safe Flights</h1>
            <h2 className="subtitle">
              Enter your flight number to see additional information about the
              kind of plane you're on and its safety track record!
            </h2>
            <div className="columns is-centered">
              <div className="column is-6">
                <div className="field">
                  <div className="columns">
                    <p className="control column">
                      <input
                        className="input"
                        type="text"
                        placeholder="DL1"
                        value={flightNumber}
                        onChange={flightNumberChanged}
                      />
                    </p>
                    <p className="control column is-2">
                      <button
                        className="button is-success is-centered"
                        onClick={flightNumberSubmitted}
                      >
                        Check my flight
                      </button>
                    </p>
                  </div>
                </div>
                <div className="field has-text-centered" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>Safe Flights</strong> by Jacob Willemsma
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
