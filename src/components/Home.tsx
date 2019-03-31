import * as React from "react";

import AirportBackground from "../images/airport-background.jpeg";

interface IHomeState {
  flightNumber: string;
}

class Home extends React.Component<{}, IHomeState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      flightNumber: ""
    };
  }

  public handleFlightChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState({ flightNumber: e.target.value });
  };

  public handleFlightNumberSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    alert("A name was submitted: " + this.state.flightNumber);
  }

  public render() {
    return (
      <div style={styles.background}>
        <div>
          Hero
          <form onSubmit={this.handleFlightNumberSubmit}>
            <input
              type="text"
              name="flight-number"
              onChange={this.handleFlightChange}
              value={this.state.flightNumber}
            />
            <button type="submit" name="flight-number-submit">
              Check flight
            </button>
          </form>
        </div>
        <p>
          Enter your flight number to better understand the type of plane you
          will be flying on and it's safety record.
        </p>
      </div>
    );
  }
}

const styles = {
  background: {
    backgroundImage: `url(${AirportBackground})`,
    height: "100%",
    width: "100%"
  }
};

export default Home;
