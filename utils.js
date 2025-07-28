/* Canadian Housing Affordability Tool - Utility Functions */

// Initialize global utilities namespace
window.HousingUtils = window.HousingUtils || {};

// Mortgage payment calculation
window.HousingUtils.mortgagePayment = function(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
         (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
}

// Metric status determination
window.HousingUtils.getMetricStatus = function(metricType, value) {
  const benchmarks = {
    saveTime: { excellent: 6, good: 12, caution: 24 },
    paymentRatio: { excellent: 25, good: 32, caution: 39 },
    coverage: { excellent: 150, good: 120, caution: 100 },
    affordabilityScore: { excellent: 80, good: 60, caution: 40 }
  };
  
  const b = benchmarks[metricType];
  if (!b) return { status: 'good', benchmark: '' };
  
  let status, benchmark;
  
  if (metricType === 'saveTime') {
    if (value < b.excellent) { status = 'excellent'; benchmark = 'Very fast saving timeline'; }
    else if (value < b.good) { status = 'good'; benchmark = 'Reasonable timeline'; }
    else if (value < b.caution) { status = 'caution'; benchmark = 'Long but manageable'; }
    else { status = 'warning'; benchmark = 'Very long timeline'; }
  } else if (metricType === 'paymentRatio') {
    if (value < b.excellent) { status = 'excellent'; benchmark = 'Well below recommended max'; }
    else if (value < b.good) { status = 'good'; benchmark = 'Within Canadian guidelines'; }
    else if (value < b.caution) { status = 'caution'; benchmark = 'Near stress test threshold'; }
    else { status = 'warning'; benchmark = 'Above recommended maximum'; }
  } else if (metricType === 'coverage') {
    if (value > b.excellent) { status = 'excellent'; benchmark = 'Strong income coverage'; }
    else if (value > b.good) { status = 'good'; benchmark = 'Adequate coverage'; }
    else if (value > b.caution) { status = 'caution'; benchmark = 'Minimal coverage'; }
    else { status = 'warning'; benchmark = 'Insufficient income'; }
  } else if (metricType === 'affordabilityScore') {
    if (value > b.excellent) { status = 'excellent'; benchmark = 'Highly affordable'; }
    else if (value > b.good) { status = 'good'; benchmark = 'Moderately affordable'; }
    else if (value > b.caution) { status = 'caution'; benchmark = 'Limited affordability'; }
    else { status = 'warning'; benchmark = 'Poor affordability'; }
  }
  
  return { status, benchmark };
}

// Generate personalized recommendations based on metrics
window.HousingUtils.getRecommendations = function(monthsToSave, paymentShare, coverage, score, grossIncome, city, cityData) {
  const recommendations = [];
  
  // Payment ratio recommendations
  if (paymentShare > 39) {
    recommendations.push({
      priority: 'high',
      title: 'Payment Ratio Too High',
      desc: `At ${paymentShare.toFixed(1)}%, your payment exceeds safe lending limits. Consider increasing income to $${Math.round(grossIncome * 32 / paymentShare / 1000) * 1000} or looking at lower-priced cities.`
    });
  } else if (paymentShare > 32) {
    recommendations.push({
      priority: 'medium', 
      title: 'Near Stress Test Threshold',
      desc: `Your ${paymentShare.toFixed(1)}% payment ratio is close to the 39% stress test limit. Consider building a larger emergency fund.`
    });
  }
  
  // Saving timeline recommendations
  if (monthsToSave > 24) {
    recommendations.push({
      priority: 'high',
      title: 'Very Long Saving Timeline', 
      desc: `${monthsToSave.toFixed(1)} months to save is challenging. Increase savings rate by 5% to reduce timeline by ${Math.round(monthsToSave * 0.3)} months.`
    });
  } else if (monthsToSave > 12) {
    recommendations.push({
      priority: 'medium',
      title: 'Consider Accelerating Savings',
      desc: `Save an extra $${Math.round(grossIncome * 0.02 / 12)} monthly to reach your goal ${Math.round(monthsToSave * 0.15)} months faster.`
    });
  }
  
  // Coverage recommendations
  if (coverage < 100) {
    recommendations.push({
      priority: 'high',
      title: 'Insufficient Income Coverage',
      desc: `Income doesn't cover housing costs. You need approximately $${Math.round((grossIncome * 1.15) / 1000) * 1000} annual income for this market.`
    });
  }
  
  // Score-based recommendations
  if (score < 40) {
    const affordableIncome = grossIncome * 1.4;
    recommendations.push({
      priority: 'high',
      title: 'Consider Alternative Markets',
      desc: `Current affordability is poor. Look at cities like Regina, Saskatoon, or Winnipeg, or increase income to $${Math.round(affordableIncome / 1000) * 1000}.`
    });
  } else if (score < 60) {
    recommendations.push({
      priority: 'medium',
      title: 'Tight Budget Scenario',
      desc: 'You\'ll meet basic needs but have limited discretionary spending. Consider a 6-month emergency fund before purchasing.'
    });
  } else if (score > 80) {
    recommendations.push({
      priority: 'low',
      title: 'Strong Affordability Position',
      desc: 'Excellent affordability! Consider upgrading to a better neighborhood or building additional savings for renovations.'
    });
  }
  
  // Generic recommendations if none triggered
  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'low',
      title: 'Good Overall Position',
      desc: 'Your housing affordability looks solid. Focus on building a 6-month emergency fund and getting pre-approved for your mortgage.'
    });
  }
  
  return recommendations;
}

// Generate suggested alternative cities based on user profile
window.HousingUtils.getSuggestedCities = function(grossIncome, savePct, rateNum, term, currentCity, currentScore, cityData) {
  const allCities = Object.keys(cityData);
  const suggestions = [];
  
  allCities.forEach(cityName => {
    if (cityName === currentCity) return;
    
    const cityInfo = cityData[cityName];
    const downPayment = cityInfo.price * 0.10;
    const monthlySaving = grossIncome * savePct / 100 / 12;
    const monthsToSave = monthlySaving > 0 ? downPayment / monthlySaving : 0;
    
    const loan = cityInfo.price - downPayment;
    const principalAndInterest = rateNum > 0 ? window.HousingUtils.mortgagePayment(loan, rateNum, term) : 0;
    const tax = cityInfo.price * cityInfo.propertyTaxRate / 12;
    const maint = cityInfo.price * cityInfo.maintenanceRate / 12;
    const totalHousing = principalAndInterest + cityInfo.utilities + tax + maint;
    
    const netIncome = grossIncome * 0.75 / 12;
    const RI = netIncome - totalHousing;
    
    let score = 0;
    if (cityInfo.subsistence) {
      if (RI >= 1.5 * cityInfo.subsistence) score = 100;
      else if (RI >= cityInfo.subsistence) score = Math.round(100 * (RI - cityInfo.subsistence) / (0.5 * cityInfo.subsistence));
      else score = 0;
    }
    
    const paymentShare = grossIncome > 0 ? principalAndInterest / (grossIncome/12) * 100 : 0;
    const scoreDiff = score - currentScore;
    
    suggestions.push({
      cityName,
      score,
      scoreDiff,
      monthsToSave,
      paymentShare,
      price: cityInfo.price,
      improvement: scoreDiff > 0
    });
  });
  
  // Sort by score improvement, then by overall score
  suggestions.sort((a, b) => {
    if (a.improvement && !b.improvement) return -1;
    if (!a.improvement && b.improvement) return 1;
    return b.score - a.score;
  });
  
  return {
    betterOptions: suggestions.filter(s => s.improvement && s.score > 60).slice(0, 3),
    alternatives: suggestions.filter(s => s.score > 50 && s.monthsToSave < 18).slice(0, 3),
    affordableOptions: suggestions.filter(s => s.paymentShare < 32).slice(0, 3)
  };
}

// Calculate comprehensive metrics for a city
window.HousingUtils.calculateCityMetrics = function(cityName, grossIncome, savePct, rateNum, term, cityData) {
  const cityInfo = cityData[cityName];
  if (!cityInfo) return null;
  
  const downPayment = cityInfo.price * 0.10;
  const monthlySaving = grossIncome * savePct / 100 / 12;
  const monthsToSave = monthlySaving > 0 ? downPayment / monthlySaving : 0;
  
  const loan = cityInfo.price - downPayment;
  const principalAndInterest = rateNum > 0 ? window.HousingUtils.mortgagePayment(loan, rateNum, term) : 0;
  const tax = cityInfo.price * cityInfo.propertyTaxRate / 12;
  const maint = cityInfo.price * cityInfo.maintenanceRate / 12;
  const totalHousing = principalAndInterest + cityInfo.utilities + tax + maint;
  
  const netIncome = grossIncome * 0.75 / 12;
  const RI = netIncome - totalHousing;
  
  let score = 0;
  if (cityInfo.subsistence) {
    if (RI >= 1.5 * cityInfo.subsistence) score = 100;
    else if (RI >= cityInfo.subsistence) score = Math.round(100 * (RI - cityInfo.subsistence) / (0.5 * cityInfo.subsistence));
    else score = 0;
  }
  
  const paymentShare = grossIncome > 0 ? principalAndInterest / (grossIncome/12) * 100 : 0;
  const coverage = totalHousing > 0 ? netIncome / totalHousing * 100 : 0;
  
  return {
    cityName,
    price: cityInfo.price,
    monthsToSave,
    paymentShare,
    coverage,
    score,
    totalHousing: totalHousing * 12,
    saveTimeStatus: window.HousingUtils.getMetricStatus('saveTime', monthsToSave),
    paymentRatioStatus: window.HousingUtils.getMetricStatus('paymentRatio', paymentShare),
    coverageStatus: window.HousingUtils.getMetricStatus('coverage', coverage),
    scoreStatus: window.HousingUtils.getMetricStatus('affordabilityScore', score)
  };
}