import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import './Stripe.css';

export class Stripe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardname: {
                value: '',
                valid: false,
                touched: false,
                msg: '',
                style: '',
            },
            email: {
                value: '',
                valid: false,
                touched: false,
                msg: '',
                style: '',
            },
        }
    }

    componentDidMount() {
        if (this.props.user) {
            let updatedEmail = { ...this.state.email }
            let updatedName = { ...this.state.cardname }
            updatedEmail.value = this.props.user.email;
            updatedName.value = this.props.user.username;
            this.setState({
                cardname: updatedName,
                email: updatedEmail,
            })
        }

    }

    inputChangedHandler(e) {
        const updatedCardname = {
            ...this.state.cardname
        };
        updatedCardname.value = e.target.value;
        let value = e.target.value.trim();
        if (value === '') {
            updatedCardname.msg = 'add a name';
            updatedCardname.valid = false;
            updatedCardname.style = 'invalid';
        } else if (value.length > 22) {
            updatedCardname.msg = 'add a shorter name';
            updatedCardname.valid = false;
            updatedCardname.style = 'invalid';
        } else {
            updatedCardname.valid = true;
            updatedCardname.msg = '';
            updatedCardname.style = '';
        }
        this.setState({
            cardname: updatedCardname
        });
    }

    inputChangedEmail(e) {

        const updatedEmail = {
            ...this.state.email
        };
        updatedEmail.value = e.target.value;
        let value = e.target.value.trim();

        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        const isValid = pattern.test(value);
        if (isValid) {
            updatedEmail.valid = true;
            updatedEmail.msg = '';
            updatedEmail.style = '';
        } else {
            updatedEmail.msg = 'Enter a valid email';
            updatedEmail.valid = false;
            updatedEmail.style = 'invalid';
        }
        this.setState({
            email: updatedEmail
        });

    }

    render() {
        return (
            <StripeProvider apiKey="pk_test_nGnyXrE92X1O1pyz8cjPEjPj00ytb8iD2s">
                <div className="Stripe">
                    <h3>Pro Upgrades</h3>
                    <div className="firstBlockWrapper">
                        <ul>
                            <li>Create premium content</li>
                            <li><em>Kwinzo.live</em>  team play</li>
                            <li>Track student progress</li>
                            <li>Remove ads</li>
                            <li>And more...</li>
                        </ul>
                        <div className="SidePro">
                            <h4>Going Pro</h4>
                            <ul>
                                <li>$2/month</li>
                                <li>Annual billing at $24.00</li>
                            </ul>
                        </div>
                    </div>
                    <div className="CheckoutNameInput">
                        <fieldset>
                            <h3>Name</h3>
                            <input
                                value={this.state.cardname.value}
                                onChange={(e) => this.inputChangedHandler(e)}
                                type="text"
                                placeholder={this.props.user.username}
                            />
                            <h3>Email</h3>
                            <input
                                value={this.state.email.value}
                                onChange={(e) => this.inputChangedEmail(e)}
                                type="text"
                                placeholder={this.props.user.email}
                            />
                        </fieldset>
                    </div>

                    <Elements>
                        <CheckoutForm email={this.state.email.value} name={this.state.cardname.value} />
                    </Elements>
                </div>
            </StripeProvider>
        );
    }
}

export default Stripe;
