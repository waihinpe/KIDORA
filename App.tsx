
import React, { useState, useEffect } from 'react';
import { Screen, Product, NewListing, User } from './types';
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

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ONBOARDING);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // Persistence check for User and Onboarding status
  useEffect(() => {
    const savedUser = localStorage.getItem('kidora_user');
    const onboardingComplete = localStorage.getItem('kidora_onboarding_complete');
    const savedCart = localStorage.getItem('kidora_cart_count');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Auth restore error:", e);
      }
    }

    if (savedCart) {
      setCartCount(parseInt(savedCart, 10));
    }

    if (onboardingComplete === 'true') {
      setCurrentScreen(Screen.HOME);
    } else {
      setCurrentScreen(Screen.ONBOARDING);
    }
    
    setIsInitializing(false);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('kidora_onboarding_complete', 'true');
    setCurrentScreen(Screen.HOME);
  };

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
    setCurrentScreen(Screen.HOME);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kidora_user');
    setCurrentScreen(Screen.LOGIN);
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen(Screen.PRODUCT_DETAIL);
  };

  const handlePublish = (listing: NewListing) => {
    console.log('Publishing listing:', listing);
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

  const renderScreen = () => {
    if (isInitializing) return <div className="h-full w-full bg-white animate-pulse" />;

    switch (currentScreen) {
      case Screen.ONBOARDING:
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case Screen.LOGIN:
        return (
          <LoginScreen 
            onLogin={handleLogin} 
            onGuest={() => setCurrentScreen(Screen.HOME)} 
          />
        );
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
            onBuyNow={() => {
              if (user) {
                setCurrentScreen(Screen.CHECKOUT);
              } else {
                setCurrentScreen(Screen.LOGIN);
              }
            }}
          />
        ) : null;
      case Screen.CHECKOUT:
        return selectedProduct ? (
          <CheckoutScreen 
            product={selectedProduct}
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

  // Screens that should not show the main bottom navigation
  const fullScreenViews = [Screen.LOGIN, Screen.ONBOARDING, Screen.SELL, Screen.PRODUCT_DETAIL, Screen.CHECKOUT];
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
