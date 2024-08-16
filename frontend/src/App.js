import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const defaultState = {
  totalBudget: '',
  fixedCosts: '',
  agencyFee: '',
  thirdPartyFee: '',
  budgets: '',
  totalBudgetError: null,
  fixedCostsError: null,
  agencyFeeError: null,
  thirdPartyFeeError: null,
  budgetsError: null,
  result: null,
  error: null
};

class BudgetForm extends React.Component {
  constructor() {
    super();
    this.state = defaultState;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCalculate = this.handleCalculate.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  validate() {
    let totalBudgetError = "";
    let fixedCostsError = "";
    let agencyFeeError = "";
    let thirdPartyFeeError = "";
    let budgetsError = "";

    // Validate total budget
    const totalBudget = parseFloat(this.state.totalBudget);
    if (!totalBudget || isNaN(totalBudget) || totalBudget <= 0) {
      totalBudgetError = "Total Budget must be a positive number";
    }

    // Validate fixed costs
    const fixedCosts = parseFloat(this.state.fixedCosts);
    if (!fixedCosts || isNaN(fixedCosts) || fixedCosts < 0) {
      fixedCostsError = "Fixed Costs must be a non-negative number";
    }

    // Validate agency fee percentage
    const agencyFee = parseFloat(this.state.agencyFee);
    if (isNaN(agencyFee) || agencyFee < 0 || agencyFee > 100) {
      agencyFeeError = "Agency Fee Percentage must be between 0 and 100";
    }

    // Validate third-party fee percentage
    const thirdPartyFee = parseFloat(this.state.thirdPartyFee);
    if (isNaN(thirdPartyFee) || thirdPartyFee < 0 || thirdPartyFee > 100) {
      thirdPartyFeeError = "Third-Party Fee Percentage must be between 0 and 100";
    }

    // Validate other ad budgets
    const adBudgets = this.state.budgets.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));
    if (adBudgets.length < 4) {
      budgetsError = "At least 4 ad budgets are required";
    } else if (adBudgets.reduce((a, b) => a + b, 0) > totalBudget) {
      budgetsError = "Sum of other ad budgets cannot be greater than the total budget";
    } else {
      // Additional validation based on the formula
      const sumOfOtherBudgets = adBudgets.reduce((a, b) => a + b, 0);
      const adBudgetsSum = adBudgets[0] + adBudgets[1] + adBudgets[3]; // Ad1 + Ad2 + Ad4
      const calculatedCost = sumOfOtherBudgets + (agencyFee / 100) * sumOfOtherBudgets + (thirdPartyFee / 100) * adBudgetsSum + fixedCosts;
      if (calculatedCost > totalBudget) {
        budgetsError = "The calculated cost exceeds the total budget, Please re-enter the values";
      }
    }

    if (totalBudgetError || fixedCostsError || agencyFeeError || thirdPartyFeeError || budgetsError) {
      this.setState({ totalBudgetError, fixedCostsError, agencyFeeError, thirdPartyFeeError, budgetsError });
      return false;
    }
    return true;
  }

  async handleCalculate() {
    if (this.validate()) {
      // Clear any previous result before making a new request
      this.setState({ result: null });
  
      const adBudgets = this.state.budgets.split(',').map(num => parseFloat(num.trim()));
  
      try {
        const response = await fetch('http://localhost:5230/api/AdBudget/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            TotalBudget: parseFloat(this.state.totalBudget),
            FixedCosts: parseFloat(this.state.fixedCosts),
            AgencyFeePercentage: parseFloat(this.state.agencyFee) / 100, // Convert percentage to decimal
            ThirdPartyFeePercentage: parseFloat(this.state.thirdPartyFee) / 100, // Convert percentage to decimal
            OtherAdBudgets: adBudgets
          })
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
  
        const data = await response.json();
        this.setState({ result: data, error: null });
      } catch (error) {
        console.error('Error during fetch:', error);
        this.setState({ error: 'Error calculating the budget. Please check your input values.', result: null });
      }
    } else {
      // Set error to null if validation fails
      this.setState({ result: null });
    }
  }
  

  render() {
    return (
      <div className="App">
        <div className="container-fluid ps-md-0">
          <div className="row g-0">
            <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
            <div className="col-md-8 col-lg-6">
              <div className="login d-flex align-items-center py-5">
                <div className="container">
                  <div className="row">
                    <div className="col-md-9 col-lg-8 mx-auto">
                      <h3 className="login-heading mb-4">Budget Optimizer</h3>

                      <form>
                        <div className="form-floating mb-3">
                          <input type="number" className={"form-control " + (this.state.totalBudgetError ? 'invalid' : '')} id="floatingTotalBudget" name='totalBudget' placeholder="Total Budget" value={this.state.totalBudget} onChange={this.handleInputChange} />
                          <label htmlFor="floatingTotalBudget">Total Budget</label>
                          <span className="text-danger">{this.state.totalBudgetError}</span>
                        </div>
                        <div className="form-floating mb-3">
                          <input type="number" className={"form-control " + (this.state.fixedCostsError ? 'invalid' : '')} id="floatingFixedCosts" name="fixedCosts" placeholder="Fixed Costs" value={this.state.fixedCosts} onChange={this.handleInputChange} />
                          <label htmlFor="floatingFixedCosts">Fixed Costs</label>
                          <span className="text-danger">{this.state.fixedCostsError}</span>
                        </div>
                        <div className="form-floating mb-3">
                          <input type="number" step="0.01" className={"form-control " + (this.state.agencyFeeError ? 'invalid' : '')} id="floatingAgencyFee" name="agencyFee" placeholder="Agency Fee Percentage" value={this.state.agencyFee} onChange={this.handleInputChange} />
                          <label htmlFor="floatingAgencyFee">Agency Fee Percentage</label>
                          <span className="text-danger">{this.state.agencyFeeError}</span>
                        </div>
                        <div className="form-floating mb-3">
                          <input type="number" step="0.01" className={"form-control " + (this.state.thirdPartyFeeError ? 'invalid' : '')} id="floatingThirdPartyFee" name="thirdPartyFee" placeholder="Third-Party Fee Percentage" value={this.state.thirdPartyFee} onChange={this.handleInputChange} />
                          <label htmlFor="floatingThirdPartyFee">Third-Party Fee Percentage</label>
                          <span className="text-danger">{this.state.thirdPartyFeeError}</span>
                        </div>
                        <div className="form-floating mb-3">
                          <input type="text" className={"form-control " + (this.state.budgetsError ? 'invalid' : '')} id="floatingBudgets" name="budgets" placeholder="Other Ad Budgets (comma-separated)" value={this.state.budgets} onChange={this.handleInputChange} />
                          <label htmlFor="floatingBudgets">Other Ad Budgets (comma-separated)</label>
                          <span className="text-danger">{this.state.budgetsError}</span>
                        </div>

                        <div className="d-grid">
                          <button className="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2" type="button" onClick={this.handleCalculate}>Calculate</button>
                          {this.state.result !== null && <div className="text-center mt-3"><h4>Maximum Budget for the ad is: {this.state.result.toFixed(2)} Euros</h4></div>}
                          {this.state.error && <div className="text-center mt-3 text-danger"><h5>{this.state.error}</h5></div>}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default BudgetForm;
