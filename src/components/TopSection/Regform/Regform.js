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
            country_name: "",
            tel: "",
            agree_1: true,
            agree_2: true,
            firstPassType: 'password',
            secondPassType: 'password',
            errorIndexes: [0,1,2,3],
            errors: '',
            passwordErrors: {
                invalidlength: true,
                nolowercase: true,
                nonumber: true,
                nouppercase: true
            }
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
        console.log(country.iso2);
        this.setState({
            phone_country_prefix: '+' + `${country.dialCode}`,
            country_name: country.iso2
        })

    };

    phoneNumberBlur = (status, value, countryData) => {
        this.setState({
            phone_country_prefix: '+' + `${countryData.dialCode}`,
            country_name: countryData.iso2
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
            let checkParams = this.props.validateParams(paramsToValidate);

            if (checkParams.success) {
                this.props.setLeadData(paramsToValidate).then(this.props.handleLeadStep(), this.props.handleStep(this.props.step + 1));
            } else {
                const fieldWithMessages = Object.keys(checkParams.errors).find(field => checkParams.errors[field].hasOwnProperty('messages'));
                const firstError = checkParams.errors[fieldWithMessages].messages[0];
                this.setState({
                    errors: firstError
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

            let submitPassword = this.props.validateParams(paramsToValidate);

            if (submitPassword.success) {
                this.props.setLeadData(paramsToValidate).then(this.props.handleLeadStep(), this.props.handleStep(this.props.step + 1));
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
                console.log(paramsToValidate);
                let submitPhone = this.props.validateParams(paramsToValidate);
                if (submitPhone.success) {
                    this.props.setLeadData(paramsToValidate).then(this.props.handleSubmit(), this.props.handleStep(this.props.step + 1));
                    this.setState({
                        errors: []
                    });
                }
                else{
                    this.setState({
                        errors: submitPhone.errors
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
            const checkPassword = this.props.validateParams({
                password: value
            });

            if (checkPassword.errors) {
                this.setState({
                    passwordErrors:  checkPassword.errors.password
                })
            }
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
                                {this.state.errors}
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
                                {Object.keys(languageManager.passtest).map((validationRule, index) => {
                                    return (<li key={index} id={index} className={this.state.passwordErrors[validationRule] ? 'list' : 'ok'}>
                                        {languageManager.passtest[validationRule]}
                                    </li>)
                                })}
                            </ul>
                            <button onClick={this.handleForward} className='start'>{languageManager.button}</button>
                        </div>
                        <div className='form-wrapper three'>
                            {this.state.errors && <div className="errors">
                                {this.state.errors[0]}
                            </div>}
                            <IntlTelInput
                                preferredCountries={[this.props.countryCode]}
                                containerClassName="intl-tel-input"
                                inputClassName="inputfield tel"
                                defaultCountry={this.state.country_name}
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
