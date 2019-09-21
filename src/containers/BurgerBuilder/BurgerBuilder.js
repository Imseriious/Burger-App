import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Loading/Loading';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';


//Global variables/constants capital letters
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    state = {
        ingredients: null,
        totalPrice: 4, //Base price
        purchasable: false, //Default value to use in the button later
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-my-burger-7b541.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data });
            })
            .catch(error => {
                this.setState({ error: true });
            });
    }

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


    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]; //Old state of the ingredient
        const updatedCount = oldCount + 1; //Add one to that state
        const updatedIngredients = {
            ...this.state.ingredients //Create a copy of the state
        };
        updatedIngredients[type] = updatedCount; //Make the state match the updateCount
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
        this.updatePurchaseState(updatedIngredients); //We check purchasable or not by sending the state 

    }

    removeIngredientHandler = (type) => { //Same logic as above but with extraction
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) { //If the oldCount is less or equal 0 we just return nothing so we dont get an error
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceSubstraction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceSubstraction;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => { //We need to use this syntax if we trigger the method by click
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        // this.setState({ loading: true })
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'Sam',
        //         adress: {
        //             street: 'TestStreet',
        //             zipCode: 'Spain'
        //         },
        //         email: 'hehe@jeje.com',
        //     },
        //     deilveryMethod: 'FAST'
        // }

        // axios.post('/orders.json', order) //Second argument is the data we want to post & .json required for firebase!
        //     .then(response => {
        //         this.setState({ loading: false, purchasing: false });
        //     })
        //     .catch(error => {
        //         this.setState({ loading: false, purchasing: false });
        //     });
        this.props.history.push('/checkout');
    };

    render() {
        const disableInfo = {
            ...this.state.ingredients
        };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }
        let orderSummary = null;

        

        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disable={disableInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        purchasing={this.purchaseHandler} />
                </Aux>
            );
            orderSummary = <OrderSummary ingredients={this.state.ingredients}
                purchasedCanceled={this.purchaseCancelHandler}
                purchasedContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice} />
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

export default withErrorHandler(BurgerBuilder, axios);