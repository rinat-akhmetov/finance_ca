/* Canadian Housing Affordability Tool - Main Application */

// Import everything from global scope (CDN compatible)
const { cityData, professions } = window.HousingData;
const { 
  mortgagePayment, 
  getMetricStatus, 
  getRecommendations, 
  getSuggestedCities, 
  calculateCityMetrics 
} = window.HousingUtils;

// Main Application Component
function App() {
  const cities = Object.keys(cityData);
  
  // Form state
  const [city, setCity] = React.useState('');
  const [incomeMode, setIncomeMode] = React.useState('');
  const [customIncome, setCustomIncome] = React.useState("");
  const [profession, setProfession] = React.useState('');
  const [savingPreset, setSavingPreset] = React.useState('');
  const [customSave, setCustomSave] = React.useState("");
  const [rate, setRate] = React.useState('');
  const [term, setTerm] = React.useState(25);
  
  // UI state
  const [comparisonCities, setComparisonCities] = React.useState([]);
  const [showComparison, setShowComparison] = React.useState(false);
  const [scenarioIncome, setScenarioIncome] = React.useState(null);
  const [scenarioSavings, setScenarioSavings] = React.useState(null);
  const [scenarioRate, setScenarioRate] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  
  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Mobile wizard navigation
  const canGoToStep = (step) => {
    if (step === 1) return true;
    if (step === 2) return city !== '';
    if (step === 3) return city !== '' && incomeMode !== '';
    if (step === 4) return city !== '' && incomeMode !== '' && (savingPreset !== '' || customSave !== '');
    return true;
  };
  
  const nextStep = () => {
    if (currentStep < 4 && canGoToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Core calculations
  const c = city ? cityData[city] : null;
  const hasValidData = c && incomeMode && (savingPreset || customSave) && rate;
  
  const grossIncome = hasValidData ? (
    incomeMode === "median" ? c.medianIncome :
    incomeMode === "average" ? c.averageIncome :
    incomeMode === "profession" ? professions[profession] || 0 :
    parseFloat(customIncome) || 0
  ) : 0;

  const savePct = hasValidData ? (
    savingPreset === "custom" ? parseFloat(customSave) || 0 : parseFloat(savingPreset) || 0
  ) : 0;
  
  const dpFrac = 0.10;
  const downPayment = hasValidData ? c.price * dpFrac : 0;
  const monthlySaving = grossIncome * savePct / 100 / 12;
  const monthsToSave = monthlySaving > 0 ? downPayment / monthlySaving : 0;

  const loan = hasValidData ? c.price - downPayment : 0;
  const rateNum = parseFloat(rate) || 0;
  const principalAndInterest = hasValidData && rateNum > 0 ? mortgagePayment(loan, rateNum, term) : 0;
  const tax = hasValidData ? c.price * c.propertyTaxRate / 12 : 0;
  const maint = hasValidData ? c.price * c.maintenanceRate / 12 : 0;
  const utilities = hasValidData ? c.utilities : 0;
  const totalHousing = principalAndInterest + utilities + tax + maint;

  const netIncome = grossIncome * 0.75 / 12;
  const RI = netIncome - totalHousing;

  let score = 0;
  if (hasValidData && c.subsistence) {
    if (RI >= 1.5 * c.subsistence) score = 100;
    else if (RI >= c.subsistence) score = Math.round(100 * (RI - c.subsistence) / (0.5 * c.subsistence));
    else score = 0;
  }

  const paymentShare = grossIncome > 0 ? principalAndInterest / (grossIncome / 12) * 100 : 0;
  const coverage = totalHousing > 0 ? netIncome / totalHousing * 100 : 0;

  // Status indicators
  const saveTimeStatus = getMetricStatus('saveTime', monthsToSave, city);
  const paymentRatioStatus = getMetricStatus('paymentRatio', paymentShare, city);
  const coverageStatus = getMetricStatus('coverage', coverage, city);
  const scoreStatus = getMetricStatus('affordabilityScore', score, city);
  
  // Recommendations and suggestions
  const recommendations = hasValidData ? getRecommendations(
    monthsToSave, paymentShare, coverage, score, grossIncome, city, c
  ) : [];
  
  const citySuggestions = hasValidData ? getSuggestedCities(
    grossIncome, savePct, rateNum, term, city, score, cityData
  ) : { betterOptions: [], alternatives: [], affordableOptions: [] };

  // Scenario modeling
  const currentIncome = grossIncome;
  const currentSavings = savePct;
  const currentRate = rateNum;
  
  const modelIncome = scenarioIncome !== null ? scenarioIncome : currentIncome;
  const modelSavings = scenarioSavings !== null ? scenarioSavings : currentSavings;
  const modelRate = scenarioRate !== null ? scenarioRate : currentRate;
  
  let scenarioMetrics = null;
  if (hasValidData && c) {
    const sDownPayment = c.price * 0.10;
    const sMonthlySaving = modelIncome * modelSavings / 100 / 12;
    const sMonthsToSave = sMonthlySaving > 0 ? sDownPayment / sMonthlySaving : 0;
    
    const sLoan = c.price - sDownPayment;
    const sPrincipalAndInterest = modelRate > 0 ? mortgagePayment(sLoan, modelRate, term) : 0;
    const sTax = c.price * c.propertyTaxRate / 12;
    const sMaint = c.price * c.maintenanceRate / 12;
    const sTotalHousing = sPrincipalAndInterest + c.utilities + sTax + sMaint;
    
    const sNetIncome = modelIncome * 0.75 / 12;
    const sRI = sNetIncome - sTotalHousing;
    
    let sScore = 0;
    if (c.subsistence) {
      if (sRI >= 1.5 * c.subsistence) sScore = 100;
      else if (sRI >= c.subsistence) sScore = Math.round(100 * (sRI - c.subsistence) / (0.5 * c.subsistence));
      else sScore = 0;
    }
    
    const sPaymentShare = modelIncome > 0 ? sPrincipalAndInterest / (modelIncome/12) * 100 : 0;
    const sCoverage = sTotalHousing > 0 ? sNetIncome / sTotalHousing * 100 : 0;
    
    scenarioMetrics = {
      monthsToSave: sMonthsToSave,
      paymentShare: sPaymentShare,
      coverage: sCoverage,
      score: sScore,
      changes: {
        monthsToSave: sMonthsToSave - monthsToSave,
        paymentShare: sPaymentShare - paymentShare,
        coverage: sCoverage - coverage,
        score: sScore - score
      }
    };
  }
  
  // Reset scenario when inputs change
  React.useEffect(() => {
    setScenarioIncome(null);
    setScenarioSavings(null);
    setScenarioRate(null);
  }, [city, incomeMode, customIncome, profession, savingPreset, customSave, rate]);

  return (
    <div className="container">
      <div className="header">
        <h2>Canadian Housing Affordability Tool</h2>
        <p>Analyze housing costs and affordability across major Canadian cities</p>
      </div>

      <div className="content">
        {/* Mobile Wizard */}
        <MobileWizard 
          cities={cities}
          city={city} setCity={setCity}
          incomeMode={incomeMode} setIncomeMode={setIncomeMode}
          profession={profession} setProfession={setProfession}
          customIncome={customIncome} setCustomIncome={setCustomIncome}
          savingPreset={savingPreset} setSavingPreset={setSavingPreset}
          customSave={customSave} setCustomSave={setCustomSave}
          rate={rate} setRate={setRate}
          professions={professions}
          currentStep={currentStep} setCurrentStep={setCurrentStep}
          canGoToStep={canGoToStep} nextStep={nextStep} prevStep={prevStep}
        />
        
        {/* Desktop Form */}
        <DesktopForm 
          cities={cities}
          city={city} setCity={setCity}
          incomeMode={incomeMode} setIncomeMode={setIncomeMode}
          profession={profession} setProfession={setProfession}
          customIncome={customIncome} setCustomIncome={setCustomIncome}
          savingPreset={savingPreset} setSavingPreset={setSavingPreset}
          customSave={customSave} setCustomSave={setCustomSave}
          rate={rate} setRate={setRate}
          professions={professions}
        />

        {/* Results Section */}
        {hasValidData && (
          <AffordabilityResults 
            monthsToSave={monthsToSave}
            paymentShare={paymentShare}
            coverage={coverage}
            score={score}
            saveTimeStatus={saveTimeStatus}
            paymentRatioStatus={paymentRatioStatus}
            coverageStatus={coverageStatus}
            scoreStatus={scoreStatus}
            recommendations={recommendations}
          />
        )}
        
        {/* Advanced Features - Hidden on mobile by default */}
        <div className={`advanced-features ${showAdvanced ? 'show' : ''}`}>
          {hasValidData && (citySuggestions.betterOptions.length > 0 || citySuggestions.alternatives.length > 0) && (
            <CitySuggestions citySuggestions={citySuggestions} setCity={setCity} />
          )}
          
          {hasValidData && (
            <ScenarioModeling 
              currentIncome={currentIncome}
              currentSavings={currentSavings}
              currentRate={currentRate}
              modelIncome={modelIncome}
              modelSavings={modelSavings}
              modelRate={modelRate}
              setScenarioIncome={setScenarioIncome}
              setScenarioSavings={setScenarioSavings}
              setScenarioRate={setScenarioRate}
              scenarioMetrics={scenarioMetrics}
            />
          )}
        </div>
        
        {/* Mobile Advanced Toggle */}
        {isMobile && hasValidData && (
          <div className="advanced-toggle">
            <button onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? 'Hide' : 'Show'} Advanced Features
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Initialize application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);