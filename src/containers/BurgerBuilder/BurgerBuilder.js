import React, {Component} from 'react';
import Wrap from '../../hoc/Wrap/Wrap'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummery/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.7,
	bacon: 0.7
};

class BurgerBuilder extends Component {

	state ={
		ingredients: null,
		totalPrice : 4,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false
	};

	componentDidMount () {
		axios.get('https://react-projekt-burger.firebaseio.com/ingredients.json')
			.then(response => {
				this.setState({ingredients: response.data})
			})
			.catch(error => {
				this.setState({error: true})
			})
	}

	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients)
			.map(ingKey => {
				return ingredients[ingKey]
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		this.setState({purchasable: sum > 0})
	}

	addIngredientHandler = (type) => {
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedIngredients[type] + 1;
		const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];

		this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
		this.updatePurchaseState(updatedIngredients);
	};

	removeIngredientHandler = (type) => {
		const updatedIngredients = {
			...this.state.ingredients
		};
		if (updatedIngredients[type] > 0) {
			updatedIngredients[type] = updatedIngredients[type] - 1;
			const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
			this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
		}
		this.updatePurchaseState(updatedIngredients);
	};

	purchaseHandler = () => {
		this.setState({purchasing: true})
	};

	purchaseCancelHandler = () => {
		this.setState({purchasing: false})
	};

	purchaseContinueHandler = () => {
		const queryParams= [];
		for (let i in this.state.ingredients){
			queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
		}
		queryParams.push('price=' + this.state.totalPrice);
		const queryString = queryParams.join('&');
		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString
		})
	};

	render() {
		const disabledInfo = {
			...this.state.ingredients
		};
		for (let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] <= 0
		}
		let orderSummary = null;
		let burger = this.state.error ? <p>Ingredient's can't be loaded</p> : <Spinner/>;

		if (this.state.ingredients) {
			burger = (
				<Wrap><Burger ingredients = {this.state.ingredients}/>
					<BuildControls
						ingredientAdded = {this.addIngredientHandler}
						ingredientRemoved = {this.removeIngredientHandler}
						disabled = {disabledInfo}
						price = {this.state.totalPrice}
						purchasable = {this.state.purchasable}
						ordered = {this.purchaseHandler}
					/>
				</Wrap>);
			orderSummary =
				<OrderSummary
					ingredients = {this.state.ingredients}
					purchaseCanceled = {this.purchaseCancelHandler}
					purchaseContinued = {this.purchaseContinueHandler}
					price ={this.state.totalPrice}
				/>;
		}

		if (this.state.loading) {
			orderSummary = <Spinner/>
		}
		return(
			<Wrap>
				<Modal show = {this.state.purchasing} modalClosed = {this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Wrap>
		);
	}
}

export default withErrorHandler(BurgerBuilder, axios);