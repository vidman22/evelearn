import React, { Component } from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import './Stripe.css';

const PAYMENT_MUTATION = gql`
  mutation Payment($tokenID: String!) {
    payment(tokenID: $tokenID)
}
`;

const createOptions = () => {
    return {
      style: {
        base: {
            fontSize: '18px',
            color: '#424770',
            fontFamily: 'Open Sans, sans-serif',
            '::placeholder': {
            color: '#aab7c4',
            fontWeight: '300',
            },
        },
        invalid: {
            color: '#c23d4b',
        },
      }
    }
  };

export class CheckoutForm extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    

    paymentCompletion(data){
        console.log("data", data);
    }


    async submit(makePayment) {
        let {token} = await this.props.stripe.createToken({name: this.props.name});
        console.log("token", token);
        let response = await fetch("/charge", {
           method: "POST",
           headers: {"Content-Type": "text/plain"},
           body: token.id,
         });
    
         if (response.ok) console.log("Purchase Complete!", response)
        makePayment({
           variables: {tokenID :token.id}
        })
    }
  render() {
    return (
        <Mutation
            mutation={PAYMENT_MUTATION}
            onCompleted={(data) => this.paymentCompletion(data)}>
                {(makePayment, {loading, error}) => (
                    <div className="checkout">
                        <h3>Card</h3>
                        <CardElement 
                            {...createOptions()}
                        />
                         <button onClick={() => this.submit(makePayment)}>
                             Review Purchase</button>
                    </div>
                )}
        </Mutation>
    );
  }
}

export default injectStripe(CheckoutForm);
