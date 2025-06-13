// Navbar.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

interface IconProps { size?: number; color?: string; }
const LayoutGridIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>🗄️</Text>;
const CheckSquareIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>✔️</Text>;
const ListTodoIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>📋</Text>;
const StickyNoteIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>📝</Text>;
const ShoppingCartIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>🛒</Text>;
const GraduationCapIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>🎓</Text>;
const ListIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>📃</Text>;
const UserIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>👤</Text>;
const XIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>✖️</Text>;
const LogOutIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>🚪</Text>;
const SettingsIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>⚙️</Text>;
const SunIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>☀️</Text>;
const MoonIcon: React.FC<IconProps> = ({ size = 20, color = 'black' }) => <Text style={{ fontSize: size, color }}>🌙</Text>;


import { useTheme } from '../contexts/ThemeContext'; // Assuming ThemeContext is adapted for RN
// import UserDropdown from './UserDropdown'; // This needs to be recreated for RN
// import ThemeToggle from './ThemeToggle'; // This needs to be recreated for RN
import { useIsMobile } from '../hooks/use-mobile'; // Assuming useIsMobile is adapted for RN
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo'; // Assuming Logo is adapted for RN

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const { width } = Dimensions.get('window');
const isMobile = width < 768; // Custom breakpoint for mobile (md in Tailwind is 768px)

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const { theme, setTheme } = useTheme();
  const { user, profile, logout } = useAuth();
  const navigation = useNavigation();
  // const isMobile = useIsMobile(); // Use the local isMobile for consistency with web logic
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGridIcon },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquareIcon },
    { id: 'habits', label: 'Hábitos', icon: ListTodoIcon },
    { id: 'todos', label: 'TODOs', icon: ListIcon },
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  // Mobile Navigation Items (limitado a 5 itens)
  const mobileNavItems = menuItems.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Navigation */}
      <View style={styles.navbar}>
        <View style={styles.navbarContent}>
          {/* Botão de menu Drawer para mobile */}
          {isMobile && (
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ marginRight: 12 }}>
              <Ionicons name="menu" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          )}
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Logo style={styles.logo} />
          </View>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              {/* Navigation Items */}
              <View style={styles.desktopNavItems}>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => setActiveSection(item.id)}
                      style={[
                        styles.navItem,
                        activeSection === item.id ? styles.activeNavItem : styles.inactiveNavItem
                      ]}
                    >
                      <Icon size={16} color={activeSection === item.id ? 'white' : '#6B7280'} />
                      <Text style={[
                        styles.navItemText,
                        activeSection === item.id ? styles.activeNavItemText : styles.inactiveNavItemText
                      ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Right side - UserDropdown & ThemeToggle needs to be adapted for RN */}
              <View style={styles.desktopRightSide}>
                {/* Simplified User Profile/Settings */}
                <TouchableOpacity onPress={() => handleNavClick('profile')} style={styles.userProfileButton}>
                  {profile?.avatar_url ? (
                    <Image
                      source={{ uri: profile.avatar_url }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.defaultAvatar}>
                      <UserIcon size={20} color="white" />
                    </View>
                  )}
                </TouchableOpacity>

                {/* Simplified Theme Toggle */}
                <TouchableOpacity
                  onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  style={styles.themeToggleButton}
                >
                  {theme === 'dark' ? (
                    <SunIcon size={20} color="#6B7280" />
                  ) : (
                    <MoonIcon size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButtonDesktop}>
                  <LogOutIcon size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Mobile Header Right */}
          {isMobile && (
            <TouchableOpacity
              onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={styles.mobileMenuToggle}
            >
              {isMobileMenuOpen ? (
                <XIcon size={20} color="#1A1A1A" />
              ) : (
                <LayoutGridIcon size={20} color="#1A1A1A" />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Mobile Menu Overlay */}
        {isMobile && isMobileMenuOpen && (
          <View style={styles.mobileMenuOverlay}>
            <View style={styles.mobileMenuDrawer}>
              {/* User Profile Section */}
              <View style={styles.mobileUserProfileSection}>
                <View style={styles.userInfoContainer}>
                  {profile?.avatar_url ? (
                    <Image
                      source={{ uri: profile.avatar_url }}
                      style={styles.mobileAvatar}
                      onError={({ nativeEvent: { error } }) => {
                        console.log('Image Load Error: ', error);
                      }}
                    />
                  ) : (
                    <View style={styles.mobileDefaultAvatar}>
                      <UserIcon size={24} color="white" />
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => handleNavClick('profile')}
                    style={styles.mobileProfileDetails}
                  >
                    <Text style={styles.mobileUserName}>{profile?.name || user?.name}</Text>
                    <Text style={styles.mobileUserEmail}>{user?.email}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Navigation Items */}
              <ScrollView style={styles.mobileNavItemsContainer}>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleNavClick(item.id)}
                      style={[
                        styles.mobileNavItem,
                        activeSection === item.id ? styles.mobileActiveNavItem : styles.mobileInactiveNavItem
                      ]}
                    >
                      <Icon size={16} color={activeSection === item.id ? 'white' : '#1A1A1A'} />
                      <Text style={[
                        styles.mobileNavItemText,
                        activeSection === item.id ? styles.mobileActiveNavItemText : styles.mobileInactiveNavItemText
                      ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {/* Settings in Mobile Menu */}
                <TouchableOpacity
                  onPress={() => handleNavClick('settings')}
                  style={[
                    styles.mobileNavItem,
                    activeSection === 'settings' ? styles.mobileActiveNavItem : styles.mobileInactiveNavItem
                  ]}
                >
                  <SettingsIcon size={16} color={activeSection === 'settings' ? 'white' : '#1A1A1A'} />
                  <Text style={[
                    styles.mobileNavItemText,
                    activeSection === 'settings' ? styles.mobileActiveNavItemText : styles.mobileInactiveNavItemText
                  ]}>
                    Configurações
                  </Text>
                </TouchableOpacity>

                {/* Theme Toggle in Mobile Menu */}
                <TouchableOpacity
                  onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  style={styles.mobileNavItem}
                >
                  {theme === 'dark' ? (
                    <>
                      <SunIcon size={16} color="#1A1A1A" />
                      <Text style={styles.mobileNavItemText}>Tema Claro</Text>
                    </>
                  ) : (
                    <>
                      <MoonIcon size={16} color="#1A1A1A" />
                      <Text style={styles.mobileNavItemText}>Tema Escuro</Text>
                    </>
                  )}
                </TouchableOpacity>
              </ScrollView>

              {/* Logout Button */}
              <View style={styles.mobileLogoutContainer}>
                <TouchableOpacity
                  onPress={handleLogout}
                  style={styles.mobileLogoutButton}
                >
                  <LogOutIcon size={16} color="#EF4444" />
                  <Text style={styles.mobileLogoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Occupy full height
    backgroundColor: '#F8F8F8', // background color
  },
  navbar: {
    backgroundColor: 'white', // card background color
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // border color
    shadowColor: '#000', // shadow-sm
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // Android shadow
    zIndex: 50,
  },
  navbarContent: {
    maxWidth: 1120, // max-w-7xl
    marginHorizontal: 'auto',
    paddingHorizontal: 12, // px-3
    height: 56, // h-14 (average of h-12 sm:h-14)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    // flex items-center
  },
  logo: {
    height: 28, // h-6 sm:h-8, choose an average
    width: 100, // adjust as needed
    resizeMode: 'contain',
  },
  // Desktop Navigation
  desktopNavItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // space-x-1
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, // px-2.5 sm:px-3
    paddingVertical: 6, // py-1.5 sm:py-2
    borderRadius: 6, // rounded-md
  },
  activeNavItem: {
    backgroundColor: '#007BFF', // primary color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // shadow-sm
  },
  inactiveNavItem: {
    // No specific background for inactive hover:bg-accent is not directly applied here
  },
  navItemText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6, // mr-1.5 sm:mr-2
  },
  activeNavItemText: {
    color: 'white', // primary-foreground
  },
  inactiveNavItemText: {
    color: '#6B7280', // muted-foreground
  },
  desktopRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // space-x-2 sm:space-x-4
  },
  userProfileButton: {
    // Styling for UserDropdown trigger
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    objectFit: 'cover',
  },
  defaultAvatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#007BFF', // primary
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleButton: {
    padding: 8,
    borderRadius: 6,
  },
  logoutButtonDesktop: {
    padding: 8,
    borderRadius: 6,
  },

  // Mobile Header
  mobileMenuToggle: {
    padding: 6, // p-1.5 sm:p-2
    borderRadius: 6, // rounded-md
  },
  // Mobile Menu Overlay
  mobileMenuOverlay: {
    position: 'absolute',
    top: 56, // top-12 sm:top-14
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // bg-background/80 backdrop-blur-sm
    zIndex: 40,
  },
  mobileMenuDrawer: {
    backgroundColor: 'white', // card background
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0', // border color
    height: '100%',
    width: 280, // w-[280px]
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    // animate-in slide-in-from-left duration-300 would need Animated API
  },
  mobileUserProfileSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // space-x-3
  },
  mobileAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    objectFit: 'cover',
  },
  mobileDefaultAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#007BFF', // primary
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileProfileDetails: {
    flex: 1,
  },
  mobileUserName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  mobileUserEmail: {
    fontSize: 12,
    color: '#6B7280',
    flexWrap: 'wrap', // truncate
  },
  mobileNavItemsContainer: {
    padding: 12, // p-3
    gap: 4, // space-y-1
  },
  mobileNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12, // px-3
    paddingVertical: 10, // py-2.5
    borderRadius: 8, // rounded-lg
  },
  mobileActiveNavItem: {
    backgroundColor: '#007BFF', // primary
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mobileInactiveNavItem: {
    // hover:bg-accent
  },
  mobileNavItemText: {
    fontSize: 14,
    marginLeft: 12, // mr-3
    color: '#1A1A1A', // foreground
  },
  mobileActiveNavItemText: {
    color: 'white', // primary-foreground
  },
  mobileInactiveNavItemText: {
    // hover:bg-accent
  },
  mobileLogoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  mobileLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  mobileLogoutButtonText: {
    fontSize: 14,
    marginLeft: 12,
    color: '#EF4444', // destructive
  },
});

export default Navbar;