import React from "react";

import { withAuthenticator } from 'aws-amplify-react'

class App extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <>
        <h1>
          Hello {name}
        </h1>
      </>
    );
  }
}

export default withAuthenticator(App, {includeGreetings: true});
