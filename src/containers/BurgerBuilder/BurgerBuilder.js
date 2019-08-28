import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

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
        ingredients: {
            salad: 0,
            bacon: 1,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4 //Base price
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
    }

    render() {
        const disableInfo = {
            ...this.state.ingredients
        };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }
        return (
            <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler}
                    disable={disableInfo} 
                    price={this.state.totalPrice}/>
            </Aux>
        );
    }
}

export default BurgerBuilder;