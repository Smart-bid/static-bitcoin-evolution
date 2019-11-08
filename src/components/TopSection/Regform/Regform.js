import React, { Component } from 'react'
import IntlTelInput from 'react-intl-tel-input'
import 'react-intl-tel-input/dist/main.css'

import { ReactComponent as Mark } from './excl.svg'
import logo from '../../BottomSection/logo.png'


export default class Regform extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            check: false,
            password: "",
            confirm_password: "",
            phone_country_prefix: "",
            tel: "",
            agree_1: true,
            agree_2: true,
            firstPassType: 'password',
            secondPassType: 'password',
            errorIndexes: [0,1,2,3]
        };

        this.handleBackwards = this.handleBackwards.bind(this);
        this.handleSync = this.handleSync.bind(this);
    }

    handleClick = (e) => {

        const input = e.target.getAttribute('data-type');
        this.setState((state) => ({
            [input] : state[input] === 'password' ? 'text' : 'password'
        }));

    };

    handleSelectFlag = (num, country) => {

        this.setState({
            phone_country_prefix: '+' + `${country.dialCode}`
        })

    };

    phoneNumberBlur = (status, value, countryData) => {
        this.setState({
            phone_country_prefix: '+' + `${countryData.dialCode}`
        })
    }

    phoneValidate = (value) => {
        return !/[^0-9\-\/]/.test(value);
    }

    handleForward = (e) => {
        let form = e.target.parentElement;
        let paramsToValidate = {};

        // Step 1
        if(this.props.step === 1){
            paramsToValidate = {
                email: this.state.email,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                agree_2: this.state.agree_2,
                funnel_name: window.location.origin,
            };
            let submitResponse = this.props.validateParams(paramsToValidate);

            if (submitResponse.success) {
                this.props.handleForward(paramsToValidate);
                this.props.handleStep(this.props.step + 1);
            }
            else{
                this.setState({
                    errors: submitResponse.errors
                })
            }
        }
        else if (this.props.step === 2){

            if (this.state.confirm_password === this.state.password) {
                paramsToValidate = {
                    password: this.state.password
                }
            } else {
                this.setState({
                    errors: ['Passwords do not match']
                })
                return this.state.errors
            }

            let submitResponse = this.props.validateParams(paramsToValidate);

            if (submitResponse.success) {
                this.props.handleForward(paramsToValidate);
                this.props.handleStep(this.props.step + 1);
            }
        }

        // Step 3
        else if (this.props.step === 3){

            let tel = form.querySelector('.tel');
            let phone_number = tel.value.replace(/^\s+|\s/g, '');

            if (!this.phoneValidate(phone_number)) {
                this.setState({
                    errors: ['Enter only number']
                });
                return this.state.errors
            }
            else if (phone_number.length > 3) {
                paramsToValidate = {
                    phone_number: phone_number,
                    phone_country_prefix: this.state.phone_country_prefix
                };

                let submitResponse = this.props.validateParams(paramsToValidate);
                if (submitResponse.success) {
                    this.props.handleSubmit(paramsToValidate);
                    this.props.handleStep(this.props.step + 1);
                }
                else{
                    this.setState({
                        errors: submitResponse.errors
                    })
                }
            } else {
                this.setState({
                    errors: ['Enter phone number']
                });
                return this.state.errors
            }
        }
    };

    handleBackwards(e) {
        e.preventDefault();
        let back = parseInt(e.target.getAttribute('index'));
        let forms = [...document.querySelectorAll('.Regform')];

        forms.map(form => {
            let steps = [...form.querySelectorAll('.form-wrapper')];
            steps.map((step, index) => {
                for (let i=0;i<=back;i++) {
                    step.classList.remove('step');
                }
            })
        });

        this.props.handleStep(parseInt(e.target.getAttribute('index')));
    }

    handleSync(e) {
        let input = e.target.value;
        let inputClass = e.target.className;
        let forms = [...document.querySelectorAll('.Regform')];

        forms.map(form => {
            form.getElementsByClassName(inputClass)[0].value = input;
        })
    }
    componentDidMount() {
        let inputs = [...document.querySelectorAll('.inputfield')];

        inputs.map(input => {
            input.addEventListener('change', this.handleSync);
        })
    }

    componentDidUpdate() {
        let forms = [...document.querySelectorAll('.Regform')];

        forms.map(form => {
            let steps = [...form.querySelectorAll('.form-wrapper')];
            steps.map((step, index) => {
                if (index+1 === this.props.step-1) {
                    step.classList.add('step');
                }
            })
        })
    }

    handleStepChange = (name, value) => {
        let errors = null;
        if (name === 'password') {
            const submitResponse = this.props.validateParams({
                password: value,
            });

            let submitErrs = [];
            let staticErrors = [
                "The password must be 8 characters long",
                "Must contain at least 1 small letter",
                "Must contain at least 1 number",
                "Must contain at least 1 capital letter",
            ];

            submitErrs.push(submitResponse.errors);

            const errorIndexes = submitErrs[0].reduce((errorsIndexesArray, error) => {
                const errorIndex = staticErrors.indexOf(error);
                errorsIndexesArray.push(errorIndex);
                return errorsIndexesArray;
            }, []);

            this.setState({ errorIndexes });
        }
        this.setState({[name]: value.replace(/^\s+|\s/g, ''), errors});
    };


    render() {
        const { 
          first_name,
          last_name,
          email,
          password,
          confirm_password,
          tel
        } = this.state;
        let languageManager = this.props.languageManager();

        if (this.props.step <= 3) {
            return (
                <div className={"Regform " + (this.props.class ? this.props.class : '')}>
                    <div className="steps">
                        {[1,2,3].map(index => {
                            if(index <= this.props.step-1) {
                                return (
                                    <div className="num check" key={index} index={index} onClick={this.handleBackwards}>✓</div>
                                )
                            } else {
                                return (
                                    <div className="num" key={index}>{index}</div>
                                )
                            }
                        })}
                    </div>
                    <div className='inner'>
                        <div className='form-wrapper one'>
                            {this.state.errors && <div className="errors">
                                {this.state.errors[0]}
                            </div>}
                            <input className="inputfield fname" type="text" name="first_name" placeholder={languageManager.fname} value={first_name} onChange={(e) => this.handleStepChange(e.target.name, e.target.value)}/>
                            <input className="inputfield lname" type="text" name="last_name" placeholder={languageManager.lname} value={last_name} onChange={(e) => this.handleStepChange(e.target.name, e.target.value)}/>
                            <input className="inputfield email" type="text" name="email" placeholder={languageManager.email} autoComplete='off' value={email} onChange={(e) => this.handleStepChange(e.target.name, e.target.value)}/>
                            <button onClick={this.handleForward} className='start'>{languageManager.button}</button>
                        </div>
                        <div className='form-wrapper two'>
                            {/*{this.state.errors && <div className="errors">
                                {this.state.errors[0]}
                            </div>}*/}
                            <div className="forw-wrapper_input">
                                <input className="inputfield pass" type={this.state.firstPassType} maxLength="8" value={password} onChange={(e) => this.handleStepChange(e.target.name, e.target.value)} name="password" placeholder={languageManager.pass}/>
                                <span onClick={this.handleClick} data-type="firstPassType" className={this.state.firstPassType === 'password' ? 'show-pass' : 'hide-pass'}></span>
                            </div>
                            <div className="help-block">
                                <div className="help-icon">
                                    <div className="help-info">
                                        <p>{languageManager.morebox}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="forw-wrapper_input pass2">
                                <input className="inputfield pass" type={this.state.secondPassType} maxLength="8" value={confirm_password} onChange={(e) => this.handleStepChange(e.target.name, e.target.value)} name="confirm_password" placeholder={languageManager.pass2}/>
                                <span onClick={this.handleClick} data-type="secondPassType" className={this.state.secondPassType === 'password' ? 'show-pass' : 'hide-pass'}></span>
                            </div>
                            <ul className='req'>
                                {languageManager.passtest.map((li, index) => {
                                    return (<li key={index} className={this.state.errorIndexes.includes(index) ? 'list' : 'ok'}>{li}</li>)
                                })}
                            </ul>
                            <button onClick={this.handleForward} className='start'>{languageManager.button}</button>
                        </div>
                        <div className='form-wrapper three'>
                            {/*{this.state.errors && <div className="errors">
                                {this.state.errors[0]}
                            </div>}*/}
                            <IntlTelInput
                                preferredCountries={[this.props.countryCode]}
                                containerClassName="intl-tel-input"
                                inputClassName="inputfield tel"
                                autoPlaceholder={true}
                                separateDialCode={true}
                                onSelectFlag={this.handleSelectFlag}
                                onPhoneNumberBlur={this.phoneNumberBlur}
                                onPhoneNumberChange={(status, value, countryData, number, id) => {
                                    if (value.length < 15) {
                                        this.setState({
                                            tel: value.replace(/^\s+|\s/g, ''),
                                        })
                                    }
                                }}
                                value={tel}
                            />
                            <button onClick={this.handleForward} className='start' >{languageManager.button_last}</button>
                        </div>
                    </div>
                    <div className="error"><Mark className='excl'/><span></span></div>
                </div>
            )
        }else {
            return (
                <div className={"Regform " + (this.props.class ? this.props.class : '')}>
                    <img src={logo} alt="lodaing" className="loading"/>
                </div>
            )

        }
    }
}
