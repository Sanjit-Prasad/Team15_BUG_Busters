import React, {Component} from 'react';
import './css/main.css';
import './css/util.css';
import './signup.css';
import Sketch from "react-p5";
const axios = require('axios');
let video;
export class Signup extends Component {
	constructor(props){
		super(props);
		this.state = {
			signup : true
		};
	}
	setup(p5, canvasParentRef) {
        p5.noCanvas();
        video = p5.createCapture(p5.VIDEO);
        const v = document.querySelector("video");
        let st = "position: absolute; top: 255px;"
        v.setAttribute("style", st);
    }

    setup2(){
    	const button = document.getElementById('submit');
        button.addEventListener('click', async event => {
		  const mood = document.getElementById('mood').value;
		  const mood2 = document.getElementById('mood2').value;
          const mood3 = document.getElementById('mood3').value;
          const mood4 = document.getElementById('mood4').value;

          video.loadPixels();
          console.log(video.canvas);
          const image64 = video.canvas.toDataURL();
          const data = { mood, mood2, mood3, mood4, image64 };
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          };
          console.log(options);
          const response = await axios.post('http://localhost:5000/register', {'image64':image64, 'username':mood, 'email':mood2, 'password':mood3, 'prescriptions':mood4});
          if(response.status==200){
		  		const tracks = document.querySelector("video").srcObject.getTracks();
		  		tracks.forEach(function(track) {
    				track.stop();
  				});
		  	};
          	this.props.backhome();
          }
        );
    }
    logout(){
    	const tracks = document.querySelector("video").srcObject.getTracks();
		  	tracks.forEach(function(track) {
    				track.stop();
  			});
    	this.props.backhome();
    }

	render(){
		let signup = (
				<div>
					<div className="limiter">
						<div className="container-login100">
							<div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
									<span className="login100-form-title p-b-53">
										Enter your details
									<div className="p-t-10 p-b-10">
										<span className="txt1">
											Username
										</span>
										<div className="wrap-input100 validate-input" data-validate = "Username is required">
											<input id="mood" className="input100" type="text" name="username" />
											<span className="focus-input100"></span>
										</div>
										<span className="txt1">
											Email Id
										</span>
										<div className="wrap-input100 validate-input" data-validate = "Username is required">
											<input id="mood2" className="input100" type="email" name="email" />
											<span className="focus-input100"></span>
										</div>
										<span className="txt1">
											Password
										</span>
										<div className="wrap-input100 validate-input" data-validate = "Username is required">
											<input id="mood3" className="input100" type="password" name="password" />
											<span className="focus-input100"></span>
										</div>
										<span className="txt1">
											Prescription Medicines
										</span>
										<div className="wrap-input100 validate-input" data-validate = "Username is required">
											<input id="mood4" className="input100" type="text" name="prescriptions" />
											<span className="focus-input100"></span>
										</div>
										{this.state.signup?<Sketch id="s" setup={this.setup} draw={this.draw}/>:''}
									</div>
									<br/>
									</span>
									<div className="container-login100-form-btn m-t-17">
										<button id="submit" onClick={this.setup2.bind(this)} className="login100-form-btn">
											Register
										</button>
									</div>
									<div className="container-login100-form-btn m-t-17">
										<button onClick={this.logout.bind(this)} className="login100-form-btn">
											Back!
										</button>
									</div>						
							</div>
						</div>
					</div>
					<div id="dropDownSelect1"></div>
				</div>
		)
    	return (<div >
    		{ signup }
    		</div>
		)
	}
}
export default Signup;