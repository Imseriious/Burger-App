import React, { Component } from 'react';
import axios from '../../../axios-orders';

import Spinner from '../../../components/UI/Loading/Loading';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false,

    }

    orderHandler = (event) => {
        event.preventDefault(); //We prevent the behavior (Send request)
        this.setState({ loading: true })
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Sam',
                adress: {
                    street: 'TestStreet',
                    zipCode: 'Spain'
                },
                email: 'hehe@jeje.com',
            },
            deilveryMethod: 'FAST'
        }

        axios.post('/orders.json', order) //Second argument is the data we want to post & .json required for firebase!
            .then(response => {
                this.setState({ loading: false });
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ loading: false });
            });
    }

    render() {
        let form = (
            <form>
                <Input  inputtype={"input"} type="text" name="name" placeholder="Your Name" />
                <Input inputtype={"input"} type="text" name="email" placeholder="Your E-Mail" />
                <Input inputtype={"input"} type="text" name="street" placeholder="Street" />
                <Input inputtype={"input"} type="text" name="postal" placeholder="Postal Code" />
                <Button btnType="Succes" clicked={this.orderHandler}>ORDER</Button>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;