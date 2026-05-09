
import React, { useState } from 'react';
import { Screen, Product, User, TransactionType } from './types';
import Layout from './components/Layout';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import SustainabilityScreen from './screens/SustainabilityScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import SellWizardScreen from './screens/SellWizardScreen';
import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import CountrySelectionScreen from './screens/CountrySelectionScreen';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('kidora_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Auth restore error:", e);
      }
    }
    return null;
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const savedUser = localStorage.getItem('kidora_user');
    const savedCountry = localStorage.getItem('kidora_country');
    if (savedUser) {
      return savedCountry ? Screen.HOME : Screen.COUNTRY_SELECTION;
    }
    return Screen.LOGIN;
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [, setCountry] = useState<string | null>(() => localStorage.getItem('kidora_country'));
  const [cartCount, setCartCount] = useState(() => {
    const savedCart = localStorage.getItem('kidora_cart_count');
    return savedCart ? parseInt(savedCart, 10) : 0;
  });
  
  const [transactionType, setTransactionType] = useState<TransactionType>('buy');
  const [inspectionSelected, setInspectionSelected] = useState(false);

  const handleLogin = (email: string) => {
    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email,
      joinedDate: new Date().toISOString(),
      rating: 5.0,
      reviewsCount: 0,
      totalEarnings: 0
    };
    setUser(mockUser);
    localStorage.setItem('kidora_user', JSON.stringify(mockUser));
    
    const savedCountry = localStorage.getItem('kidora_country');
    if (savedCountry) {
      setCountry(savedCountry);
      setCurrentScreen(Screen.HOME);
    } else {
      setCurrentScreen(Screen.COUNTRY_SELECTION);
    }
  };

  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
    localStorage.setItem('kidora_country', selectedCountry);
    setCurrentScreen(Screen.HOME);
  };

  const handleLogout = () => {
    setUser(null);
    setCountry(null);
    localStorage.removeItem('kidora_user');
    localStorage.removeItem('kidora_country');
    setCurrentScreen(Screen.LOGIN);
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen(Screen.PRODUCT_DETAIL);
  };

  const handlePublish = () => {
    setCurrentScreen(Screen.PROFILE);
  };

  const handleSellClick = () => {
    if (user) {
      setCurrentScreen(Screen.SELL);
    } else {
      setCurrentScreen(Screen.LOGIN);
    }
  };

  const handleAddToBag = (quantity: number) => {
    const newCount = cartCount + quantity;
    setCartCount(newCount);
    localStorage.setItem('kidora_cart_count', newCount.toString());
    alert(`Added ${quantity} item(s) to your bag!`);
  };

  const handleOrderComplete = () => {
    alert("Order Placed Successfully! 🎉\nCheck your profile for order status.");
    setCartCount(0);
    localStorage.setItem('kidora_cart_count', '0');
    setCurrentScreen(Screen.HOME);
    setSelectedProduct(null);
  };

  const proceedToCheckout = (type: TransactionType, inspection: boolean) => {
    if (!user) {
      setCurrentScreen(Screen.LOGIN);
      return;
    }
    setTransactionType(type);
    setInspectionSelected(inspection);
    setCurrentScreen(Screen.CHECKOUT);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.ONBOARDING:
        return <OnboardingScreen onComplete={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.LOGIN:
        return (
          <LoginScreen 
            onLogin={handleLogin} 
            onGuest={() => setCurrentScreen(Screen.HOME)} 
          />
        );
      case Screen.COUNTRY_SELECTION:
        return <CountrySelectionScreen onSelect={handleCountrySelect} />;
      case Screen.HOME:
        return (
          <HomeScreen 
            user={user}
            cartCount={cartCount}
            onProductClick={navigateToProduct} 
            onExploreClick={() => setCurrentScreen(Screen.EXPLORE)} 
            onSellClick={handleSellClick}
          />
        );
      case Screen.EXPLORE:
        return <ExploreScreen onProductClick={navigateToProduct} />;
      case Screen.SUSTAINABILITY:
        return <SustainabilityScreen />;
      case Screen.PROFILE:
        return (
          <ProfileScreen 
            user={user} 
            onLogout={handleLogout} 
            onLoginPrompt={() => setCurrentScreen(Screen.LOGIN)}
            onNavigateToImpact={() => setCurrentScreen(Screen.SUSTAINABILITY)}
          />
        );
      case Screen.SELL:
        return (
          <SellWizardScreen 
            onClose={() => setCurrentScreen(Screen.HOME)} 
            onPublish={handlePublish}
          />
        );
      case Screen.PRODUCT_DETAIL:
        return selectedProduct ? (
          <ProductDetailScreen 
            product={selectedProduct} 
            onAddToBag={handleAddToBag}
            onBack={() => {
              setCurrentScreen(Screen.EXPLORE);
              setSelectedProduct(null);
            }}
            onProceedToCheckout={proceedToCheckout}
          />
        ) : null;
      case Screen.CHECKOUT:
        return selectedProduct ? (
          <CheckoutScreen 
            product={selectedProduct}
            transactionType={transactionType}
            initialInspection={inspectionSelected}
            onBack={() => setCurrentScreen(Screen.PRODUCT_DETAIL)}
            onOrderComplete={handleOrderComplete}
          />
        ) : null;
      default:
        return (
          <HomeScreen 
            user={user}
            cartCount={cartCount}
            onProductClick={navigateToProduct} 
            onExploreClick={() => setCurrentScreen(Screen.EXPLORE)} 
            onSellClick={handleSellClick}
          />
        );
    }
  }

  const fullScreenViews = [Screen.LOGIN, Screen.COUNTRY_SELECTION, Screen.ONBOARDING, Screen.SELL, Screen.PRODUCT_DETAIL, Screen.CHECKOUT];
  const isFullScreen = fullScreenViews.includes(currentScreen);

  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-[#f1f3f5] md:flex md:items-center md:justify-center p-0 md:p-8">
        <div className="w-full max-w-md bg-white shadow-xl h-screen overflow-hidden relative border-x border-gray-100">
          {renderScreen()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f5] md:flex md:items-center md:justify-center p-0 md:p-8">
      <Layout activeScreen={currentScreen} setScreen={setCurrentScreen}>
        {renderScreen()}
      </Layout>
    </div>
  );
};

export default App;
