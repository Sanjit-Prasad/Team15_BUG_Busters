import React, {Component} from 'react';
import './css/main.css';
import './css/util.css';
import './signup.css';
const axios = require('axios');
export class Homepage extends Component {
	constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
  
  setup2(){
  const button = document.getElementById('submit');
    button.addEventListener('click', async event => {
      const mood = document.getElementById('mood').value;
      const data = { mood };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      console.log(options);
      const response = await axios.post('http://localhost:5000/register', {'userData': mood});
      if(response.status==200){
        alert("Medicines refilled successfully!");
      } else {
        alert("Wrong Medicine provided, Please re-check!");
      }
    }
    );
  }

  logout(){
    this.props.logout();
  }

	render(){
		let userInputForm = (
				<div>
					<div className="limiter">
						<div className="container-login100">
							<div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
									<span className="login100-form-title p-b-53">
										Welcome {this.state.name}
                  </span>
                  <span className="login100-form-title p-b-53">
										Enter Medicine name to refill.
                  </span>
									<div className="wrap-input100 validate-input" data-validate = "Medicines is required">
										<input id="mood" className="input100" type="text" name="userData" />
										<span className="focus-input100"></span>
									</div>
									<br/><br/>
									<div className="container-login100-form-btn m-t-17">
										<button id="submit" onClick={this.setup2.bind(this)} className="login100-form-btn">
											Submit
										</button>
									</div>
									<div className="container-login100-form-btn m-t-17">
										<button onClick={this.logout.bind(this)} className="login100-form-btn">
											Logout
										</button>
									</div>					
							</div>
						</div>
					</div>
					<div id="dropDownSelect1"></div>
				</div>
		)
    	return (<div >
    		{ userInputForm }
    		</div>
		)
	}
}
export default Homepage;