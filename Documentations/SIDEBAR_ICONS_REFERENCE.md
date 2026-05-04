# Sidebar Icons Reference - React Icons

## ✅ Current Implementation

Your sidebar now uses **React Icons** - a professional, monochrome icon library perfect for modern dashboards.

### Current Icons Used

| Section | Icon Component | Visual |
|---------|---------------|--------|
| **Logo** | `RiGovernmentFill` | Government building icon |
| **Home** | `HiHome` | House icon |
| **Place Order** | `HiShoppingCart` | Shopping cart icon |
| **Admin Dashboard** | `HiChartBar` | Bar chart icon |
| **Finance** | `HiCurrencyDollar` | Dollar sign icon |
| **Reports** | `HiDocumentText` | Document icon |
| **Inventory** | `HiCube` | Cube/box icon |
| **Announcements** | `HiSpeakerphone` | Megaphone icon |
| **Documents** | `HiFolder` | Folder icon |
| **Logout** | `HiLogout` | Logout arrow icon |
| **Login** | `HiLogin` | Login arrow icon |

## Alternative Logo Options

If you want to change the government building logo, here are some professional alternatives:

### Government/Organization Logos
```jsx
import { 
  RiGovernmentFill,      // Government building (current)
  RiGovernmentLine,      // Government building outline
  RiBuildingFill,        // Generic building
  RiCommunityFill,       // Community/organization
  RiShieldStarFill,      // Shield with star (authority)
  RiMedalFill,           // Medal (achievement)
  RiTrophyFill,          // Trophy (excellence)
} from 'react-icons/ri';

import {
  HiOfficeBuilding,      // Office building
  HiLibrary,             // Library/institution
  HiAcademicCap,         // Academic/education
} from 'react-icons/hi';

import {
  FaLandmark,            // Classical building/landmark
  FaUniversity,          // University building
  FaBalanceScale,        // Justice/balance
  FaGavel,               // Law/authority
} from 'react-icons/fa';
```

### Simple Geometric Logos
```jsx
import {
  RiShapeFill,           // Abstract shape
  RiHexagonFill,         // Hexagon
  RiStarFill,            // Star
  RiShieldFill,          // Shield
} from 'react-icons/ri';

import {
  HiCube,                // 3D cube
  HiSparkles,            // Sparkles
  HiStar,                // Star outline
} from 'react-icons/hi';
```

### Letter-based Logos
```jsx
// You can also use a simple letter with styling:
<div className={styles.logo}>
  <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>S</span>
</div>
```

## Alternative Navigation Icons

### Home Alternatives
```jsx
import { HiHome, HiHomeModern } from 'react-icons/hi2';
import { AiOutlineHome, AiFillHome } from 'react-icons/ai';
```

### Order/Shopping Alternatives
```jsx
import { HiShoppingCart, HiShoppingBag } from 'react-icons/hi';
import { BsCart, BsCartFill, BsBag } from 'react-icons/bs';
import { FiShoppingCart } from 'react-icons/fi';
```

### Dashboard Alternatives
```jsx
import { HiChartBar, HiChartPie, HiChartSquareBar } from 'react-icons/hi';
import { MdDashboard, MdSpaceDashboard } from 'react-icons/md';
import { RiDashboardFill, RiDashboardLine } from 'react-icons/ri';
```

### Finance Alternatives
```jsx
import { HiCurrencyDollar, HiCash } from 'react-icons/hi';
import { FaMoneyBillWave, FaCoins, FaWallet } from 'react-icons/fa';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
```

### Reports Alternatives
```jsx
import { HiDocumentText, HiDocument, HiClipboardList } from 'react-icons/hi';
import { BsFileText, BsFileEarmarkText } from 'react-icons/bs';
import { FaFileAlt, FaClipboardList } from 'react-icons/fa';
```

### Inventory Alternatives
```jsx
import { HiCube, HiArchive } from 'react-icons/hi';
import { BsBox, BsBoxSeam } from 'react-icons/bs';
import { FaBoxes, FaWarehouse } from 'react-icons/fa';
import { RiArchiveFill } from 'react-icons/ri';
```

### Announcements Alternatives
```jsx
import { HiSpeakerphone, HiBell, HiMegaphone } from 'react-icons/hi';
import { BsBellFill, BsMegaphone } from 'react-icons/bs';
import { FaBullhorn, FaBell } from 'react-icons/fa';
```

### Documents Alternatives
```jsx
import { HiFolder, HiFolderOpen } from 'react-icons/hi';
import { BsFolder, BsFolderFill } from 'react-icons/bs';
import { FaFolder, FaFolderOpen } from 'react-icons/fa';
```

## How to Change Icons

### 1. Change a Navigation Icon
In `Sidebar.jsx`, update the icon in the `navItems` array:

```jsx
// Before
{ to: "/inventory", text: "Inventory", icon: HiCube, roles: [...] }

// After (using warehouse icon)
{ to: "/inventory", text: "Inventory", icon: FaWarehouse, roles: [...] }
```

Don't forget to import the new icon at the top:
```jsx
import { FaWarehouse } from 'react-icons/fa';
```

### 2. Change the Logo Icon
In `Sidebar.jsx`, find the logo section and replace `RiGovernmentFill`:

```jsx
// Before
import { RiGovernmentFill } from 'react-icons/ri';
<RiGovernmentFill className={styles.logoIcon} />

// After (using landmark icon)
import { FaLandmark } from 'react-icons/fa';
<FaLandmark className={styles.logoIcon} />
```

## Icon Libraries in React Icons

React Icons includes multiple icon sets:

- **Hi** (Hero Icons) - Modern, clean icons (recommended for UI)
- **Ri** (Remix Icons) - Comprehensive, consistent set
- **Fa** (Font Awesome) - Most popular, extensive collection
- **Bs** (Bootstrap Icons) - Simple, professional
- **Ai** (Ant Design Icons) - Clean, minimal
- **Fi** (Feather Icons) - Ultra-minimal, elegant
- **Md** (Material Design Icons) - Google's design system
- **Io** (Ionicons) - Mobile-first design

## Benefits of React Icons

✅ **Simple & Clean**: Monochrome icons that look professional  
✅ **Consistent**: All icons follow the same design language  
✅ **Lightweight**: Tree-shakeable (only imports what you use)  
✅ **Customizable**: Easy to style with CSS (color, size, etc.)  
✅ **No Configuration**: Works out of the box  
✅ **Accessible**: Proper SVG implementation  
✅ **Free**: MIT licensed, no restrictions  

## Styling Icons

Icons inherit color from their parent and can be styled:

```css
/* In your CSS module */
.navIcon {
  font-size: 1.25rem;      /* Size */
  color: currentColor;      /* Inherits parent color */
  transition: all 0.2s;     /* Smooth animations */
}

.navIcon:hover {
  transform: scale(1.1);    /* Hover effect */
}
```

## Resources

- **React Icons Documentation**: https://react-icons.github.io/react-icons/
- **Search Icons**: https://react-icons.github.io/react-icons/search
- **Icon Preview**: Browse all available icons on the website

## Quick Tips

1. **Keep it consistent**: Use icons from the same family (e.g., all Hi icons)
2. **Size matters**: Icons should be 20-24px for navigation
3. **Test visibility**: Ensure icons are clear at small sizes
4. **Accessibility**: Icons should have text labels or aria-labels
5. **Performance**: React Icons is tree-shakeable, so import only what you need

## Example: Changing to a Different Icon Set

If you want to use Feather Icons (ultra-minimal) instead:

```jsx
// Import from Feather Icons
import { 
  FiHome, 
  FiShoppingCart, 
  FiBarChart2, 
  FiDollarSign, 
  FiFileText, 
  FiPackage, 
  FiMegaphone, 
  FiFolder,
  FiLogOut,
  FiLogIn
} from 'react-icons/fi';
import { FiLayers } from 'react-icons/fi'; // For logo

// Update navItems
const navItems = [
  { to: "/", text: "Home", icon: FiHome, roles: [...] },
  { to: "/order", text: "Place Order", icon: FiShoppingCart, roles: [...] },
  // ... etc
];

// Update logo
<FiLayers className={styles.logoIcon} />
```

This gives you an even more minimal, elegant look!
