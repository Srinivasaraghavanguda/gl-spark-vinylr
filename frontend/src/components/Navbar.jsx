import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Trash2,
  Package,
  Heart,
  Settings,
  Key,
  Edit3,
  ArrowRight,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

/* =========================================================
   NAVIGATION
   ========================================================= */

const NAV_LINKS = [
  {
    name: "HOME",
    path: "/",
  },
  {
    name: "ALBUMS",
    path: "/albums",
  },
  {
    name: "MERCH",
    path: "/merch",
  },
  {
    name: "TRENDING",
    path: "/trending",
  },
  {
    name: "CONCERTS",
    path: "/concerts",
  },
];

/* =========================================================
   NAVBAR
   ========================================================= */

const Navbar = () => {
  const [isScrolled, setIsScrolled] =
    useState(false);

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  /* Dropdown states */

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const [
    isProfileOpen,
    setIsProfileOpen,
  ] = useState(false);

  /* Cart */

  const [cartItems, setCartItems] =
    useState([]);

  /* User */

  const [username, setUsername] =
    useState("");

  const [role, setRole] =
    useState("");

  const location = useLocation();
  const navigate = useNavigate();

  /* Refs */

  const cartRef = useRef(null);
  const profileRef = useRef(null);

  /* =========================================================
     SCROLL EFFECT
     ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(
        window.scrollY > 20
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =========================================================
     CART LISTENER
     ========================================================= */

  useEffect(() => {
    const fetchCart = () => {
      try {
        const storedCart =
          localStorage.getItem(
            "vinylr_cart"
          );

        const cart = storedCart
          ? JSON.parse(storedCart)
          : [];

        setCartItems(
          Array.isArray(cart)
            ? cart
            : []
        );
      } catch (error) {
        console.error(
          "Unable to load cart:",
          error
        );

        setCartItems([]);
      }
    };

    fetchCart();

    window.addEventListener(
      "cartUpdated",
      fetchCart
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        fetchCart
      );
    };
  }, []);

  /* =========================================================
     USER INFORMATION
     ========================================================= */

  useEffect(() => {
    const loadUser = () => {
      setUsername(
        localStorage.getItem(
          "vinylr_user"
        ) || ""
      );

      setRole(
        localStorage.getItem(
          "vinylr_role"
        ) || ""
      );
    };

    loadUser();

    window.addEventListener(
      "storage",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadUser
      );
    };
  }, []);

  /* =========================================================
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
     ========================================================= */

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(
          event.target
        )
      ) {
        setIsCartOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     CART OPERATIONS
     ========================================================= */

  const removeFromCart = (
    cartKey
  ) => {
    const updatedCart =
      cartItems.filter(
        (item) =>
          item.cartKey !== cartKey
      );

    setCartItems(updatedCart);

    localStorage.setItem(
      "vinylr_cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    toast.success(
      "Item removed",
      {
        style: {
          background: "#12080B",
          color: "#fff",
          border:
            "1px solid #E11D2E",
        },
      }
    );
  };

  /* =========================================================
     CART TOTALS
     ========================================================= */

  const cartTotal =
    cartItems.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

  const cartItemCount =
    cartItems.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0),
      0
    );

  /* =========================================================
     LOGOUT
     ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "vinylr_jwt"
    );

    localStorage.removeItem(
      "vinylr_user"
    );

    localStorage.removeItem(
      "vinylr_role"
    );

    window.dispatchEvent(
      new Event("storage")
    );

    toast.success(
      "Successfully logged out.",
      {
        style: {
          background: "#12080B",
          color: "#fff",
          border:
            "1px solid #E11D2E",
        },
      }
    );

    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);

    navigate("/login");
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <nav
      className={`
        fixed
        top-0
        left-0
        w-full
        z-50
        transition-all
        duration-500
        font-['Oswald']

        ${
          isScrolled
            ? `
              bg-[#080609]/92
              backdrop-blur-2xl
              py-3
              border-b
              border-[#E11D2E]/25
              shadow-[0_10px_45px_rgba(0,0,0,0.70)]
            `
            : `
              bg-[#080609]/72
              backdrop-blur-xl
              py-5
              border-b
              border-white/[0.06]
            `
        }
      `}
    >
      {/* =====================================================
          TOP RED LIGHT
          ===================================================== */}

      <div
        className="
          absolute
          top-0
          left-0
          right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#FF5965]
          to-transparent
          opacity-80
          pointer-events-none
        "
      />

      <div
        className="
          max-w-[1700px]
          mx-auto
          px-5
          sm:px-6
          lg:px-8
          flex
          items-center
          justify-between
          gap-5
        "
      >
        {/* ===================================================
            LOGO
            =================================================== */}

        <Link
  to="/"
  className="
    relative
    flex-shrink-0
    font-['Orbitron']
    text-2xl
    sm:text-3xl
    font-black
    italic
    tracking-widest
    select-none
    text-transparent
    bg-clip-text
    bg-gradient-to-b
    from-[#FF929A]
    via-[#E11D2E]
    to-[#760711]
    drop-shadow-[0_0_18px_rgba(225,29,46,0.65)]
    -skew-x-6
  "
>
  VINYLR
</Link>

        {/* ===================================================
            DESKTOP NAVIGATION
            =================================================== */}

        <div
  className="
    hidden
    lg:flex
    flex-1
    items-center
    justify-center
    px-8
    xl:px-12
  "
>
  <div
    className="
      w-full
      max-w-[850px]
      grid
      grid-cols-5
      gap-3
      xl:gap-4
    "
  >
    {NAV_LINKS.map((link) => {
      const isActive =
        location.pathname === link.path;

      return (
        <Link
          key={link.name}
          to={link.path}
          className={`
            relative
            overflow-hidden
            w-full
            px-3
            xl:px-4
            py-2.5
            rounded-xl
            text-xs
            xl:text-sm
            font-bold
            tracking-[0.14em]
            uppercase
            text-center
            transition-all
            duration-300

            ${
              isActive
                ? `
                  text-white
                  bg-gradient-to-b
                  from-[#FF5965]
                  via-[#E11D2E]
                  to-[#800914]
                  border
                  border-[#FF7A84]/45
                  shadow-[0_0_25px_rgba(225,29,46,0.40)]
                `
                : `
                  text-white/55
                  bg-white/[0.025]
                  border
                  border-white/[0.07]
                  hover:text-white
                  hover:bg-[#E11D2E]/10
                  hover:border-[#E11D2E]/45
                  hover:shadow-[0_0_22px_rgba(225,29,46,0.18)]
                `
            }
          `}
        >
          <span
            className="
              absolute
              inset-x-0
              top-0
              h-1/2
              bg-gradient-to-b
              from-white/[0.10]
              to-transparent
              pointer-events-none
            "
          />

          <span className="relative z-10">
            {link.name}
          </span>
        </Link>
      );
    })}
  </div>
</div>

        {/* ===================================================
            RIGHT SIDE ICONS
            =================================================== */}

        <div
          className="
            hidden
            lg:flex
            items-center
            gap-3
            flex-shrink-0
          "
        >
          {/* =================================================
              CART
              ================================================= */}

          <div
            className="relative"
            ref={cartRef}
          >
            <button
              onClick={() => {
                setIsCartOpen(
                  !isCartOpen
                );

                setIsProfileOpen(false);
              }}
              className="
                relative
                w-11
                h-11
                rounded-xl
                bg-white/[0.025]
                border
                border-white/[0.08]
                flex
                items-center
                justify-center
                text-white/70
                hover:text-white
                hover:bg-[#E11D2E]/10
                hover:border-[#E11D2E]/50
                hover:shadow-[0_0_24px_rgba(225,29,46,0.25)]
                transition-all
                duration-300
                group
              "
              aria-label="Open cart"
            >
              <ShoppingCart
                className="
                  w-5
                  h-5
                  group-hover:scale-110
                  group-hover:text-[#FF5965]
                  transition-all
                "
              />

              {/* Top reflection */}

              <span
                className="
                  absolute
                  top-0
                  left-1/2
                  -translate-x-1/2
                  w-6
                  h-px
                  bg-white/30
                "
              />

              {/* Cart count */}

              <AnimatePresence>
                {cartItemCount >
                  0 && (
                  <motion.span
                    initial={{
                      scale: 0,
                    }}
                    animate={{
                      scale: 1,
                    }}
                    exit={{
                      scale: 0,
                    }}
                    className="
                      absolute
                      -top-2
                      -right-2
                      w-5
                      h-5
                      rounded-full
                      flex
                      items-center
                      justify-center
                      bg-gradient-to-b
                      from-[#FF5965]
                      to-[#8B0E1A]
                      border
                      border-[#FF7A84]/40
                      text-white
                      text-[10px]
                      font-black
                      shadow-[0_0_12px_rgba(225,29,46,0.8)]
                    "
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* =================================================
                MINI CART
                ================================================= */}

            <AnimatePresence>
              {isCartOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    absolute
                    right-0
                    top-14
                    w-80
                    bg-[#10090C]/96
                    backdrop-blur-2xl
                    border
                    border-[#E11D2E]/25
                    rounded-2xl
                    shadow-[0_25px_70px_rgba(0,0,0,0.85)]
                    overflow-hidden
                  "
                >
                  {/* Cart header */}

                  <div
                    className="
                      relative
                      p-4
                      border-b
                      border-[#E11D2E]/15
                      bg-gradient-to-r
                      from-[#1A080C]
                      via-[#21090E]
                      to-[#10070A]
                    "
                  >
                    <div
                      className="
                        absolute
                        top-0
                        left-0
                        right-0
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-[#FF5965]
                        to-transparent
                      "
                    />

                    <h3
                      className="
                        text-white
                        font-bold
                        tracking-widest
                        uppercase
                        text-sm
                      "
                    >
                      Your Cart{" "}
                      <span className="text-[#FF5965]">
                        ({cartItemCount})
                      </span>
                    </h3>
                  </div>

                  {/* Cart items */}

                  <div
                    className="
                      max-h-80
                      overflow-y-auto
                      p-4
                      space-y-3
                    "
                  >
                    {cartItems.length ===
                    0 ? (
                      <div
                        className="
                          text-center
                          text-white/35
                          py-8
                          font-light
                          uppercase
                          tracking-widest
                          text-xs
                        "
                      >
                        Cart is empty
                      </div>
                    ) : (
                      cartItems.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={
                              item.cartKey ||
                              item.id ||
                              index
                            }
                            className="
                              flex
                              items-center
                              gap-3
                              bg-white/[0.025]
                              p-2
                              rounded-xl
                              border
                              border-white/[0.06]
                              hover:border-[#E11D2E]/25
                              transition-colors
                            "
                          >
                            {/* Image */}

                            <div
                              className="
                                w-12
                                h-12
                                bg-[#09080A]
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                border
                                border-white/10
                                text-[8px]
                                text-white/40
                                font-bold
                                uppercase
                                overflow-hidden
                                flex-shrink-0
                              "
                            >
                              {item.imageUrl ? (
                                <img
                                  src={
                                    item.imageUrl
                                  }
                                  alt={
                                    item.title ||
                                    "Cart item"
                                  }
                                  className="
                                    w-full
                                    h-full
                                    object-cover
                                  "
                                />
                              ) : (
                                item.genre ||
                                item.category ||
                                "IMG"
                              )}
                            </div>

                            {/* Information */}

                            <div
                              className="
                                flex-1
                                overflow-hidden
                                min-w-0
                              "
                            >
                              <h4
                                className="
                                  text-white
                                  text-xs
                                  font-bold
                                  truncate
                                "
                              >
                                {item.title}
                              </h4>

                              <p
                                className="
                                  text-[#FF5965]
                                  text-xs
                                  mt-1
                                "
                              >
                                ₹
                                {Number(
                                  item.price ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}

                                <span className="text-white/40">
                                  {" "}
                                  ×{" "}
                                  {
                                    item.quantity
                                  }
                                </span>
                              </p>
                            </div>

                            {/* Remove */}

                            <button
                              onClick={() =>
                                removeFromCart(
                                  item.cartKey
                                )
                              }
                              className="
                                p-2
                                text-white/30
                                hover:text-[#FF5965]
                                transition-colors
                              "
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      )
                    )}
                  </div>

                  {/* Total */}

                  {cartItems.length >
                    0 && (
                    <div
                      className="
                        p-4
                        border-t
                        border-[#E11D2E]/15
                        bg-[#09070A]/85
                      "
                    >
                      <div
                        className="
                          flex
                          justify-between
                          items-center
                          mb-4
                        "
                      >
                        <span
                          className="
                            text-white/40
                            text-xs
                            uppercase
                            tracking-widest
                          "
                        >
                          Subtotal
                        </span>

                        <span
                          className="
                            text-white
                            font-bold
                            text-lg
                          "
                        >
                          ₹
                          {cartTotal.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setIsCartOpen(
                            false
                          );

                          navigate(
                            "/cart"
                          );
                        }}
                        className="
                          w-full
                          py-3
                          rounded-xl
                          bg-gradient-to-b
                          from-[#FF5965]
                          via-[#E11D2E]
                          to-[#800914]
                          hover:brightness-110
                          text-white
                          font-black
                          uppercase
                          tracking-widest
                          text-xs
                          shadow-[0_0_22px_rgba(225,29,46,0.35)]
                          flex
                          items-center
                          justify-center
                          gap-2
                          group
                          transition-all
                        "
                      >
                        BUY NOW

                        <ArrowRight
                          className="
                            w-4
                            h-4
                            group-hover:translate-x-1
                            transition-transform
                          "
                        />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================
              PROFILE
              ================================================= */}

          <div
            className="relative"
            ref={profileRef}
          >
            <button
              onClick={() => {
                setIsProfileOpen(
                  !isProfileOpen
                );

                setIsCartOpen(false);
              }}
              className="
                relative
                w-11
                h-11
                rounded-xl
                bg-white/[0.025]
                border
                border-white/[0.08]
                flex
                items-center
                justify-center
                text-white/70
                hover:text-white
                hover:bg-[#E11D2E]/10
                hover:border-[#E11D2E]/50
                hover:shadow-[0_0_24px_rgba(225,29,46,0.25)]
                transition-all
                duration-300
                group
              "
              aria-label="Open profile"
            >
              <User
                className="
                  w-5
                  h-5
                  group-hover:scale-110
                  group-hover:text-[#FF5965]
                  transition-all
                "
              />

              <span
                className="
                  absolute
                  top-0
                  left-1/2
                  -translate-x-1/2
                  w-6
                  h-px
                  bg-white/30
                "
              />
            </button>

            {/* =================================================
                PROFILE DROPDOWN
                ================================================= */}

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    absolute
                    right-0
                    top-14
                    w-72
                    bg-[#10090C]/96
                    backdrop-blur-2xl
                    border
                    border-[#E11D2E]/25
                    rounded-2xl
                    shadow-[0_25px_70px_rgba(0,0,0,0.85)]
                    overflow-hidden
                  "
                >
                  {/* Profile header */}

                  <div
                    className="
                      relative
                      p-6
                      border-b
                      border-[#E11D2E]/15
                      bg-gradient-to-b
                      from-[#220A10]
                      to-[#10070A]
                      flex
                      flex-col
                      items-center
                    "
                  >
                    <div
                      className="
                        absolute
                        top-0
                        left-0
                        right-0
                        h-px
                        bg-gradient-to-r
                        from-transparent
                        via-[#FF5965]
                        to-transparent
                      "
                    />

                    <div
                      className="
                        relative
                        mb-3
                      "
                    >
                      <div
                        className="
                          w-20
                          h-20
                          rounded-full
                          bg-[#09080A]
                          border-2
                          border-[#E11D2E]/60
                          shadow-[0_0_25px_rgba(225,29,46,0.25)]
                          flex
                          items-center
                          justify-center
                          text-[#FF5965]
                          overflow-hidden
                        "
                      >
                        <User className="w-10 h-10 opacity-60" />
                      </div>

                      <button
                        className="
                          absolute
                          bottom-0
                          right-0
                          w-7
                          h-7
                          bg-gradient-to-b
                          from-[#FF5965]
                          to-[#8B0E1A]
                          rounded-full
                          border-2
                          border-[#12080B]
                          flex
                          items-center
                          justify-center
                          text-white
                          hover:scale-110
                          transition-transform
                          shadow-lg
                        "
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3
                      className="
                        text-white
                        font-bold
                        text-lg
                        tracking-wide
                      "
                    >
                      {username
                        ? username.split(
                            "@"
                          )[0]
                        : "Guest User"}
                    </h3>

                    <p
                      className="
                        text-[#FF5965]
                        text-xs
                        tracking-widest
                        font-light
                        mt-1
                      "
                    >
                      {username ||
                        "guest@vinylr.com"}
                    </p>
                  </div>

                  {/* Profile menu */}

                  <div
                    className="
                      p-2
                      space-y-1
                      bg-[#09080A]/90
                    "
                  >
                    {/* Orders */}

                    <button
                      onClick={() => {
                        setIsProfileOpen(
                          false
                        );

                        navigate(
                          "/orders"
                        );
                      }}
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-xl
                        hover:bg-[#E11D2E]/10
                        text-white/45
                        hover:text-white
                        transition-colors
                        group
                      "
                    >
                      <Package
                        className="
                          w-4
                          h-4
                          group-hover:scale-110
                          transition-transform
                        "
                      />

                      <span
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-widest
                        "
                      >
                        My Orders &
                        Tracking
                      </span>
                    </button>

                    {/* Favorites */}

                    <button
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-xl
                        hover:bg-[#E11D2E]/10
                        text-white/45
                        hover:text-[#FF5965]
                        transition-colors
                        group
                      "
                    >
                      <Heart
                        className="
                          w-4
                          h-4
                          group-hover:scale-110
                          transition-transform
                        "
                      />

                      <span
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-widest
                        "
                      >
                        Favourited
                        Items
                      </span>
                    </button>

                    <div
                      className="
                        h-px
                        w-full
                        bg-white/[0.05]
                        my-1
                      "
                    />

                    {/* Settings */}

                    <button
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-xl
                        hover:bg-[#E11D2E]/10
                        text-white/45
                        hover:text-white
                        transition-colors
                        group
                      "
                    >
                      <Settings
                        className="
                          w-4
                          h-4
                          group-hover:rotate-90
                          transition-transform
                        "
                      />

                      <span
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-widest
                        "
                      >
                        Profile
                        Settings
                      </span>
                    </button>

                    {/* Password */}

                    <button
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-xl
                        hover:bg-[#E11D2E]/10
                        text-white/45
                        hover:text-white
                        transition-colors
                        group
                      "
                    >
                      <Key
                        className="
                          w-4
                          h-4
                          group-hover:scale-110
                          transition-transform
                        "
                      />

                      <span
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-widest
                        "
                      >
                        Change
                        Password
                      </span>
                    </button>

                    {/* Logout */}

                    <button
                      onClick={
                        handleLogout
                      }
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-xl
                        hover:bg-[#E11D2E]/15
                        text-[#E11D2E]
                        transition-colors
                        group
                        mt-2
                        border
                        border-transparent
                        hover:border-[#E11D2E]/30
                      "
                    >
                      <LogOut
                        className="
                          w-4
                          h-4
                          group-hover:-translate-x-1
                          transition-transform
                        "
                      />

                      <span
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-widest
                        "
                      >
                        Log Out
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ===================================================
            MOBILE MENU BUTTON
            =================================================== */}

        <button
          className="
            lg:hidden
            w-11
            h-11
            text-white/80
            bg-white/[0.025]
            p-2
            rounded-xl
            border
            border-white/[0.08]
            hover:border-[#E11D2E]/50
            hover:bg-[#E11D2E]/10
            hover:text-[#FF5965]
            transition-all
          "
          onClick={() =>
            setIsMobileMenuOpen(
              !isMobileMenuOpen
            )
          }
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* ====================================================
          MOBILE MENU
          ==================================================== */}

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="
              lg:hidden
              bg-[#09070A]/96
              backdrop-blur-2xl
              border-b
              border-[#E11D2E]/20
              overflow-hidden
            "
          >
            <div
              className="
                flex
                flex-col
                px-5
                py-6
                space-y-3
              "
            >
              {NAV_LINKS.map(
                (link) => {
                  const isActive =
                    location.pathname ===
                    link.path;

                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() =>
                        setIsMobileMenuOpen(
                          false
                        )
                      }
                      className={`
                        relative
                        overflow-hidden
                        p-4
                        rounded-xl
                        text-center
                        text-sm
                        font-bold
                        tracking-widest
                        uppercase
                        transition-all

                        ${
                          isActive
                            ? `
                              bg-gradient-to-b
                              from-[#FF5965]
                              via-[#E11D2E]
                              to-[#800914]
                              text-white
                              border
                              border-[#FF7A84]/40
                              shadow-[0_0_25px_rgba(225,29,46,0.3)]
                            `
                            : `
                              bg-white/[0.025]
                              text-white/65
                              border
                              border-white/[0.07]
                              hover:border-[#E11D2E]/40
                              hover:text-white
                              hover:bg-[#E11D2E]/10
                            `
                        }
                      `}
                    >
                      <span
                        className="
                          absolute
                          inset-x-0
                          top-0
                          h-1/2
                          bg-gradient-to-b
                          from-white/[0.12]
                          to-transparent
                          pointer-events-none
                        "
                      />

                      <span
                        className="
                          relative
                          z-10
                        "
                      >
                        {link.name}
                      </span>
                    </Link>
                  );
                }
              )}

              {/* Mobile actions */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  pt-4
                  border-t
                  border-white/[0.06]
                "
              >
                <Link
                  to="/cart"
                  onClick={() =>
                    setIsMobileMenuOpen(
                      false
                    )
                  }
                  className="
                    p-4
                    rounded-xl
                    text-center
                    bg-white/[0.025]
                    text-white
                    font-bold
                    uppercase
                    border
                    border-white/[0.07]
                    hover:border-[#E11D2E]/40
                    hover:bg-[#E11D2E]/10
                    flex
                    flex-col
                    items-center
                    gap-2
                    text-xs
                    tracking-widest
                    transition-all
                  "
                >
                  <ShoppingCart
                    className="
                      w-5
                      h-5
                      text-[#FF5965]
                    "
                  />

                  Cart (
                  {cartItemCount})
                </Link>

                <button
                  onClick={() => {
                    handleLogout();

                    setIsMobileMenuOpen(
                      false
                    );
                  }}
                  className="
                    p-4
                    rounded-xl
                    text-center
                    bg-[#E11D2E]/10
                    text-[#FF5965]
                    font-bold
                    uppercase
                    border
                    border-[#E11D2E]/20
                    hover:bg-[#E11D2E]/20
                    flex
                    flex-col
                    items-center
                    gap-2
                    text-xs
                    tracking-widest
                    transition-all
                  "
                >
                  <LogOut className="w-5 h-5" />

                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;