import React, { Component } from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Loading/Loading';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    
    state = {
        purchasable: false, //Default value to use in the button later
        purchasing: false,
        loading: false,
        error: false
    }

    // componentDidMount() {
    //     axios.get('https://react-my-burger-7b541.firebaseio.com/ingredients.json')
    //         .then(response => {
    //             this.setState({ ingredients: response.data });
    //         })
    //         .catch(error => {
    //             this.setState({ error: true });
    //         });
    // }

    updatePurchaseState(ingredients) { //ingredient state coming from handlers. 
        const sum = Object.keys(ingredients) //We go trought ingredients and transform in array
            .map(igKey => { //Map trougth them 
                return ingredients[igKey] //We acces the value in that ingredient and return it
            })
            .reduce((sum, el) => { //Sum is the variable that increases with every loop, el is the current element we get from above
                return sum + el;
            }, 0); //We start sum with 0
        this.setState({ purchasable: sum > 0 }) //If sum is more than 0 purchasable = true
    }

    purchaseHandler = () => { //We need to use this syntax if we trigger the method by click
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    };

    render() {
        const disableInfo = {
            ...this.props.ings
        };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }
        let orderSummary = null;

        

        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disable={disableInfo}
                        price={this.props.price}
                        purchasable={this.state.purchasable}
                        purchasing={this.purchaseHandler} />
                </Aux>
            );
            orderSummary = <OrderSummary ingredients={this.props.ings}
                purchasedCanceled={this.purchaseCancelHandler}
                purchasedContinued={this.purchaseContinueHandler}
                price={this.props.price} />
        }
        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return{
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));