/* Canadian Housing Affordability Tool - React Components */

// Initialize global components namespace
window.HousingComponents = window.HousingComponents || {};

// Reusable searchable selector component
function SearchableSelector({ options, value, onChange, placeholder, allowCustom = false }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [inputValue, setInputValue] = React.useState(value || '');
  const [selectedValue, setSelectedValue] = React.useState(value || '');
  const dropdownId = React.useRef(`dropdown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  
  React.useEffect(() => {
    setInputValue(value || '');
    setSelectedValue(value || '');
  }, [value]);
  
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
    setIsOpen(true);
    
    if (allowCustom) {
      onChange(newValue);
      setSelectedValue(newValue);
    }
  };
  
  const handleOptionSelect = (option) => {
    setInputValue(option);
    setSelectedValue(option);
    setSearchTerm('');
    setIsOpen(false);
    onChange(option);
  };
  
  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue('');
    setSelectedValue('');
    setSearchTerm('');
    setIsOpen(true);
    onChange('');
  };
  
  const handleInputFocus = () => {
    setIsOpen(true);
    if (!allowCustom && selectedValue) {
      setSearchTerm('');
      setInputValue('');
    } else {
      setSearchTerm(inputValue);
    }
  };
  
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      if (!allowCustom && selectedValue && !searchTerm) {
        setInputValue(selectedValue);
      }
    }, 200);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      if (!allowCustom && selectedValue) {
        setInputValue(selectedValue);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && !inputValue && selectedValue) {
      handleClear(e);
    }
  };
  
  const handleContainerClick = () => {
    setIsOpen(true);
  };
  
  const displayValue = isOpen && !allowCustom ? searchTerm : inputValue;
  const hasValue = selectedValue && selectedValue.length > 0;
  const showPlaceholder = !hasValue && !isOpen;
  
  return (
    <div className={`searchable-selector ${isOpen ? 'dropdown-open' : ''}`}>
      <div className="selector-input-container" onClick={handleContainerClick}>
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={showPlaceholder ? placeholder : ''}
          className={`selector-input ${hasValue ? 'has-value' : ''}`}
          aria-label={placeholder}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          role="combobox"
          autoComplete="off"
        />
        <div className="selector-controls">
          {hasValue && (
            <button
              type="button"
              className="selector-clear"
              onClick={handleClear}
              aria-label="Clear selection"
              title="Clear selection"
            >
              ×
            </button>
          )}
          <svg 
            className="selector-chevron" 
            viewBox="0 0 16 16" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div 
          className="selector-dropdown" 
          role="listbox"
          data-dropdown-id={dropdownId.current}
        >
          {filteredOptions.slice(0, 10).map((option, index) => (
            <div
              key={`${option}-${index}`}
              className="selector-option"
              onMouseDown={() => handleOptionSelect(option)}
              role="option"
              aria-selected={selectedValue === option}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Mobile wizard component for step-by-step input
function MobileWizard({ 
  cities, 
  city, setCity,
  incomeMode, setIncomeMode,
  profession, setProfession,
  customIncome, setCustomIncome,
  savingPreset, setSavingPreset,
  customSave, setCustomSave,
  rate, setRate,
  professions,
  currentStep, setCurrentStep,
  canGoToStep, nextStep, prevStep
}) {
  return (
    <div className="mobile-wizard">
      <div className="step-indicator">
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step}
            className={`step-dot ${
              step === currentStep ? 'active' : 
              step < currentStep ? 'completed' : ''
            }`}
          />
        ))}
      </div>
      
      <div className={`mobile-step ${currentStep === 1 ? 'active' : ''}`}>
        <div className="form-group">
          <label>Choose Your City</label>
          <SearchableSelector
            options={cities}
            value={city}
            onChange={setCity}
            placeholder="Search or select a city..."
          />
        </div>
      </div>
      
      <div className={`mobile-step ${currentStep === 2 ? 'active' : ''}`}>
        <div className="form-group">
          <label>Income Source</label>
          <SearchableSelector
            options={["Median Household", "Average Household", "By Profession", "Custom Amount"]}
            value={incomeMode === "median" ? "Median Household" :
                   incomeMode === "average" ? "Average Household" :
                   incomeMode === "profession" ? "By Profession" : 
                   incomeMode === "custom" ? "Custom Amount" : ""}
            onChange={(value) => {
              const modeMap = {
                "Median Household": "median",
                "Average Household": "average", 
                "By Profession": "profession",
                "Custom Amount": "custom"
              };
              setIncomeMode(modeMap[value] || "");
            }}
            placeholder="Select income source..."
          />
          
          {incomeMode === "profession" && (
            <div style={{marginTop: '1rem'}}>
              <SearchableSelector
                options={Object.keys(professions)}
                value={profession}
                onChange={setProfession}
                placeholder="Search profession..."
              />
            </div>
          )}

          {incomeMode === "custom" && (
            <div style={{marginTop: '1rem'}}>
              <SearchableSelector
                options={["$50,000", "$60,000", "$70,000", "$80,000", "$90,000", "$100,000", "$120,000", "$150,000", "$200,000"]}
                value={customIncome}
                onChange={setCustomIncome}
                placeholder="Type or select income (e.g., 85000)..."
                allowCustom={true}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className={`mobile-step ${currentStep === 3 ? 'active' : ''}`}>
        <div className="form-group">
          <label>Savings Rate</label>
          <SearchableSelector
            options={[
              "Average Canada (10%)",
              `Average ${city || 'City'} (12%)`,
              "Aggressive Saver (15%)",
              "Super Saver (20%)",
              "Custom Rate"
            ]}
            value={savingPreset === "10" ? "Average Canada (10%)" :
                   savingPreset === "12" ? `Average ${city || 'City'} (12%)` :
                   savingPreset === "15" ? "Aggressive Saver (15%)" :
                   savingPreset === "20" ? "Super Saver (20%)" : 
                   savingPreset === "custom" ? "Custom Rate" : ""}
            onChange={(value) => {
              if (value.includes("10%")) setSavingPreset("10");
              else if (value.includes("12%")) setSavingPreset("12");
              else if (value.includes("15%")) setSavingPreset("15");
              else if (value.includes("20%")) setSavingPreset("20");
              else if (value.includes("Custom")) setSavingPreset("custom");
              else setSavingPreset("");
            }}
            placeholder="Select savings rate..."
          />
          
          {savingPreset === "custom" && (
            <div style={{marginTop: '1rem'}}>
              <SearchableSelector
                options={["5%", "8%", "10%", "12%", "15%", "18%", "20%", "25%", "30%"]}
                value={customSave}
                onChange={setCustomSave}
                placeholder="Type or select savings rate (e.g., 14)..."
                allowCustom={true}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className={`mobile-step ${currentStep === 4 ? 'active' : ''}`}>
        <div className="form-group">
          <label>Mortgage Rate</label>
          <SearchableSelector
            options={["8% (Current Average)", "12% (Higher Rate)", "18% (Stress Test)"]}
            value={rate === "8" ? "8% (Current Average)" :
                   rate === "12" ? "12% (Higher Rate)" : 
                   rate === "18" ? "18% (Stress Test)" : ""}
            onChange={(value) => {
              if (value.includes("8%")) setRate("8");
              else if (value.includes("12%")) setRate("12");
              else if (value.includes("18%")) setRate("18");
              else setRate("");
            }}
            placeholder="Select mortgage rate..."
          />
        </div>
      </div>
      
      <div className="step-navigation">
        <button 
          className="step-btn prev"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button 
          className="step-btn next"
          onClick={nextStep}
          disabled={!canGoToStep(currentStep + 1) || currentStep === 4}
        >
          {currentStep === 4 ? 'View Results' : 'Next'}
        </button>
      </div>
    </div>
  );
}

// Desktop form component
function DesktopForm({ 
  cities, 
  city, setCity,
  incomeMode, setIncomeMode,
  profession, setProfession,
  customIncome, setCustomIncome,
  savingPreset, setSavingPreset,
  customSave, setCustomSave,
  rate, setRate,
  professions
}) {
  return (
    <div className="form-grid desktop-form">
      <div className="form-group">
        <label>City</label>
        <SearchableSelector
          options={cities}
          value={city}
          onChange={setCity}
          placeholder="Search or select a city..."
        />
      </div>

      <div className="form-group">
        <label>Income Source</label>
        <SearchableSelector
          options={["Median Household", "Average Household", "By Profession", "Custom Amount"]}
          value={incomeMode === "median" ? "Median Household" :
                 incomeMode === "average" ? "Average Household" :
                 incomeMode === "profession" ? "By Profession" : 
                 incomeMode === "custom" ? "Custom Amount" : ""}
          onChange={(value) => {
            const modeMap = {
              "Median Household": "median",
              "Average Household": "average", 
              "By Profession": "profession",
              "Custom Amount": "custom"
            };
            setIncomeMode(modeMap[value] || "");
          }}
          placeholder="Select income source..."
        />
        
        {incomeMode === "profession" && (
          <div style={{marginTop: '1rem'}}>
            <SearchableSelector
              options={Object.keys(professions)}
              value={profession}
              onChange={setProfession}
              placeholder="Search profession..."
            />
          </div>
        )}

        {incomeMode === "custom" && (
          <div style={{marginTop: '1rem'}}>
            <SearchableSelector
              options={["$50,000", "$60,000", "$70,000", "$80,000", "$90,000", "$100,000", "$120,000", "$150,000", "$200,000"]}
              value={customIncome}
              onChange={setCustomIncome}
              placeholder="Type or select income (e.g., 85000)..."
              allowCustom={true}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Savings Rate</label>
        <SearchableSelector
          options={[
            "Average Canada (10%)",
            `Average ${city || 'City'} (12%)`,
            "Aggressive Saver (15%)",
            "Super Saver (20%)",
            "Custom Rate"
          ]}
          value={savingPreset === "10" ? "Average Canada (10%)" :
                 savingPreset === "12" ? `Average ${city || 'City'} (12%)` :
                 savingPreset === "15" ? "Aggressive Saver (15%)" :
                 savingPreset === "20" ? "Super Saver (20%)" : 
                 savingPreset === "custom" ? "Custom Rate" : ""}
          onChange={(value) => {
            if (value.includes("10%")) setSavingPreset("10");
            else if (value.includes("12%")) setSavingPreset("12");
            else if (value.includes("15%")) setSavingPreset("15");
            else if (value.includes("20%")) setSavingPreset("20");
            else if (value.includes("Custom")) setSavingPreset("custom");
            else setSavingPreset("");
          }}
          placeholder="Select savings rate..."
        />
        
        {savingPreset === "custom" && (
          <div style={{marginTop: '1rem'}}>
            <SearchableSelector
              options={["5%", "8%", "10%", "12%", "15%", "18%", "20%", "25%", "30%"]}
              value={customSave}
              onChange={setCustomSave}
              placeholder="Type or select savings rate (e.g., 14)..."
              allowCustom={true}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Mortgage Rate</label>
        <SearchableSelector
          options={["8% (Current Average)", "12% (Higher Rate)", "18% (Stress Test)"]}
          value={rate === "8" ? "8% (Current Average)" :
                 rate === "12" ? "12% (Higher Rate)" : 
                 rate === "18" ? "18% (Stress Test)" : ""}
          onChange={(value) => {
            if (value.includes("8%")) setRate("8");
            else if (value.includes("12%")) setRate("12");
            else if (value.includes("18%")) setRate("18");
            else setRate("");
          }}
          placeholder="Select mortgage rate..."
        />
      </div>
    </div>
  );
}

// Results display component  
function AffordabilityResults({ 
  monthsToSave, paymentShare, coverage, score,
  saveTimeStatus, paymentRatioStatus, coverageStatus, scoreStatus,
  recommendations 
}) {
  return (
    <div className="result">
      <h3>Affordability Analysis</h3>
      <div className="metrics-grid">
        <div className={`metric ${saveTimeStatus.status}`}>
          <div className="metric-label">Time to Save Down Payment</div>
          <div className="metric-value">{monthsToSave.toFixed(1)} months</div>
          <div className="metric-benchmark">{saveTimeStatus.benchmark}</div>
          <div className={`metric-status status-${saveTimeStatus.status}`}>{saveTimeStatus.status}</div>
        </div>
        
        <div className={`metric ${paymentRatioStatus.status}`}>
          <div className="metric-label">Payment to Income Ratio</div>
          <div className="metric-value">{paymentShare.toFixed(1)}%</div>
          <div className="metric-benchmark">{paymentRatioStatus.benchmark}</div>
          <div className={`metric-status status-${paymentRatioStatus.status}`}>{paymentRatioStatus.status}</div>
        </div>
        
        <div className={`metric ${coverageStatus.status}`}>
          <div className="metric-label">Income Coverage</div>
          <div className="metric-value">{coverage.toFixed(1)}%</div>
          <div className="metric-benchmark">{coverageStatus.benchmark}</div>
          <div className={`metric-status status-${coverageStatus.status}`}>{coverageStatus.status}</div>
        </div>
        
        <div className={`score ${scoreStatus.status}`}>
          <div className="score-value">{score}</div>
          <div className="score-label">Affordability Score</div>
          <div className="metric-benchmark" style={{marginTop: '0.5rem', fontSize: '1rem'}}>{scoreStatus.benchmark}</div>
          <div className={`metric-status status-${scoreStatus.status}`} style={{marginTop: '0.5rem'}}>{scoreStatus.status}</div>
        </div>
      </div>
      
      {recommendations.length > 0 && (
        <div className="recommendations">
          <h4>
            <span>💡</span>
            Personalized Recommendations
          </h4>
          {recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-item priority-${rec.priority}`}>
              <div className="recommendation-title">{rec.title}</div>
              <div className="recommendation-desc">{rec.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// City suggestions component
function CitySuggestions({ citySuggestions, setCity }) {
  if (!citySuggestions.betterOptions.length && !citySuggestions.alternatives.length) {
    return null;
  }

  return (
    <div className="suggestions-section">
      <h4 className="suggestions-title">
        <span>🎯</span>
        Alternative Cities
      </h4>
      
      {citySuggestions.betterOptions.length > 0 && (
        <div className="suggestion-category">
          <h5>🚀 Better Affordability Options</h5>
          <div className="suggestion-grid">
            {citySuggestions.betterOptions.map(city => (
              <div 
                key={city.cityName} 
                className="suggestion-card better"
                onClick={() => setCity(city.cityName)}
              >
                <div className="suggestion-name">{city.cityName}</div>
                <div className="suggestion-metrics">
                  <div>Score: {city.score}/100 (+{city.scoreDiff})</div>
                  <div>Price: ${city.price.toLocaleString()}</div>
                  <div>Save time: {city.monthsToSave.toFixed(1)} months</div>
                </div>
                <div className="suggestion-highlight">+{city.scoreDiff} Better</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {citySuggestions.alternatives.length > 0 && (
        <div className="suggestion-category">
          <h5>🏡 Quick-Save Alternatives</h5>
          <div className="suggestion-grid">
            {citySuggestions.alternatives.map(city => (
              <div 
                key={city.cityName} 
                className="suggestion-card"
                onClick={() => setCity(city.cityName)}
              >
                <div className="suggestion-name">{city.cityName}</div>
                <div className="suggestion-metrics">
                  <div>Score: {city.score}/100</div>
                  <div>Price: ${city.price.toLocaleString()}</div>
                  <div>Save time: {city.monthsToSave.toFixed(1)} months</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {citySuggestions.affordableOptions.length > 0 && (
        <div className="suggestion-category">
          <h5>💰 Payment-Safe Options</h5>
          <div className="suggestion-grid">
            {citySuggestions.affordableOptions.map(city => (
              <div 
                key={city.cityName} 
                className="suggestion-card affordable"
                onClick={() => setCity(city.cityName)}
              >
                <div className="suggestion-name">{city.cityName}</div>
                <div className="suggestion-metrics">
                  <div>Score: {city.score}/100</div>
                  <div>Payment ratio: {city.paymentShare.toFixed(1)}%</div>
                  <div>Price: ${city.price.toLocaleString()}</div>
                </div>
                <div className="suggestion-highlight">Safe Ratio</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Scenario modeling component
function ScenarioModeling({ 
  currentIncome, currentSavings, currentRate,
  modelIncome, modelSavings, modelRate,
  setScenarioIncome, setScenarioSavings, setScenarioRate,
  scenarioMetrics 
}) {
  return (
    <div className="scenario-section">
      <h4 className="scenario-title">
        <span>🎯</span>
        What-If Scenario Analysis
      </h4>
      
      <div className="scenario-controls">
        <div className="scenario-control">
          <div className="scenario-label">
            Annual Income
            <span className="scenario-current">Current: ${currentIncome.toLocaleString()}</span>
          </div>
          <input
            type="range"
            className="scenario-slider"
            min={Math.max(30000, currentIncome * 0.7)}
            max={currentIncome * 1.5}
            step={5000}
            value={modelIncome}
            onChange={(e) => setScenarioIncome(parseFloat(e.target.value))}
          />
          <div className="scenario-values">
            <span>${Math.max(30000, currentIncome * 0.7).toLocaleString()}</span>
            <span className="current-value">${modelIncome.toLocaleString()}</span>
            <span>${(currentIncome * 1.5).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="scenario-control">
          <div className="scenario-label">
            Savings Rate
            <span className="scenario-current">Current: {currentSavings}%</span>
          </div>
          <input
            type="range"
            className="scenario-slider"
            min={5}
            max={30}
            step={1}
            value={modelSavings}
            onChange={(e) => setScenarioSavings(parseFloat(e.target.value))}
          />
          <div className="scenario-values">
            <span>5%</span>
            <span className="current-value">{modelSavings}%</span>
            <span>30%</span>
          </div>
        </div>
        
        <div className="scenario-control">
          <div className="scenario-label">
            Mortgage Rate
            <span className="scenario-current">Current: {currentRate}%</span>
          </div>
          <input
            type="range"
            className="scenario-slider"
            min={4}
            max={20}
            step={0.5}
            value={modelRate}
            onChange={(e) => setScenarioRate(parseFloat(e.target.value))}
          />
          <div className="scenario-values">
            <span>4%</span>
            <span className="current-value">{modelRate}%</span>
            <span>20%</span>
          </div>
        </div>
      </div>
      
      {scenarioMetrics && (
        <div className="scenario-impact">
          <div className="impact-grid">
            <div className="impact-item">
              <div className="impact-label">Save Time</div>
              <div className="impact-value">{scenarioMetrics.monthsToSave.toFixed(1)} months</div>
              {scenarioMetrics.changes.monthsToSave !== 0 && (
                <div className={`impact-change ${scenarioMetrics.changes.monthsToSave < 0 ? 'positive' : 'negative'}`}>
                  {scenarioMetrics.changes.monthsToSave > 0 ? '+' : ''}{scenarioMetrics.changes.monthsToSave.toFixed(1)} months
                </div>
              )}
            </div>
            
            <div className="impact-item">
              <div className="impact-label">Payment Ratio</div>
              <div className="impact-value">{scenarioMetrics.paymentShare.toFixed(1)}%</div>
              {scenarioMetrics.changes.paymentShare !== 0 && (
                <div className={`impact-change ${scenarioMetrics.changes.paymentShare < 0 ? 'positive' : 'negative'}`}>
                  {scenarioMetrics.changes.paymentShare > 0 ? '+' : ''}{scenarioMetrics.changes.paymentShare.toFixed(1)}%
                </div>
              )}
            </div>
            
            <div className="impact-item">
              <div className="impact-label">Income Coverage</div>
              <div className="impact-value">{scenarioMetrics.coverage.toFixed(0)}%</div>
              {scenarioMetrics.changes.coverage !== 0 && (
                <div className={`impact-change ${scenarioMetrics.changes.coverage > 0 ? 'positive' : 'negative'}`}>
                  {scenarioMetrics.changes.coverage > 0 ? '+' : ''}{scenarioMetrics.changes.coverage.toFixed(0)}%
                </div>
              )}
            </div>
            
            <div className="impact-item">
              <div className="impact-label">Affordability Score</div>
              <div className="impact-value">{scenarioMetrics.score}/100</div>
              {scenarioMetrics.changes.score !== 0 && (
                <div className={`impact-change ${scenarioMetrics.changes.score > 0 ? 'positive' : 'negative'}`}>
                  {scenarioMetrics.changes.score > 0 ? '+' : ''}{scenarioMetrics.changes.score.toFixed(0)} points
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}