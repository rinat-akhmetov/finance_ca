/* Canadian Housing Affordability Tool - React Components */

// Simple SearchableSelector component using React.createElement (no JSX)
function SearchableSelector(props) {
  const { options, value, onChange, placeholder, allowCustom = false } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [inputValue, setInputValue] = React.useState(value || '');
  const [selectedValue, setSelectedValue] = React.useState(value || '');
  
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
  
  const displayValue = isOpen && !allowCustom ? searchTerm : inputValue;
  const hasValue = selectedValue && selectedValue.length > 0;
  const showPlaceholder = !hasValue && !isOpen;
  
  return React.createElement('div', 
    { className: `searchable-selector ${isOpen ? 'dropdown-open' : ''}` },
    React.createElement('div', 
      { 
        className: 'selector-input-container',
        onClick: () => setIsOpen(true)
      },
      React.createElement('input', {
        type: 'text',
        value: displayValue,
        onChange: handleInputChange,
        onFocus: () => setIsOpen(true),
        onBlur: () => setTimeout(() => setIsOpen(false), 200),
        placeholder: showPlaceholder ? placeholder : '',
        className: `selector-input ${hasValue ? 'has-value' : ''}`,
        autoComplete: 'off'
      }),
      React.createElement('div', 
        { className: 'selector-controls' },
        hasValue && React.createElement('button', {
          type: 'button',
          className: 'selector-clear',
          onClick: handleClear
        }, '×'),
        React.createElement('svg', {
          className: 'selector-chevron',
          viewBox: '0 0 16 16',
          fill: 'currentColor'
        }, React.createElement('path', {
          d: 'M4 6l4 4 4-4',
          stroke: 'currentColor',
          strokeWidth: '2',
          fill: 'none'
        }))
      )
    ),
    isOpen && filteredOptions.length > 0 && React.createElement('div',
      { className: 'selector-dropdown' },
      filteredOptions.slice(0, 10).map((option, index) =>
        React.createElement('div', {
          key: `${option}-${index}`,
          className: 'selector-option',
          onMouseDown: () => handleOptionSelect(option)
        }, option)
      )
    )
  );
}

// Make components globally available
window.SearchableSelector = SearchableSelector;