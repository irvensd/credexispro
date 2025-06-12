import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Users, BarChart, Check, Mail, Phone, MapPin, Clock, Target, Award, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Secure Dispute Management',
    description: 'Handle disputes efficiently with our secure and compliant platform. Bank-level encryption ensures your data is always protected.',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Automated Workflows',
    description: 'Streamline your processes with intelligent automation and templates. Save hours with automated dispute letters and follow-ups.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Client Portal',
    description: 'Provide your clients with a professional, easy-to-use portal. Real-time updates and transparent communication.',
    comingSoon: true,
  },
  {
    icon: <BarChart className="w-8 h-8" />,
    title: 'Advanced Analytics',
    description: 'Make data-driven decisions with comprehensive analytics and reporting. Track success rates and optimize strategies.',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Client Management CRM',
    description: 'Efficiently manage all your clients in one place. Track cases, organize documents, and maintain detailed client histories.',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Compliance Ready',
    description: 'Stay compliant with FCRA, FDCPA, and other regulations. Built-in compliance checks and documentation.',
  },
];

const pricingPlans = [
  {
    name: 'Basic',
    price: 29,
    description: 'Perfect for individuals and small businesses',
    features: [
      'Up to 50 clients',
      'Basic dispute management',
      'Email support',
      'Standard templates',
      'Basic analytics',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: 49,
    description: 'Ideal for growing businesses',
    features: [
      'Up to 200 clients',
      'Advanced dispute management',
      'Priority email support',
      'Custom templates',
      'Advanced analytics',
      'API access',
      'Custom branding',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For large organizations with advanced needs',
    features: [
      'Unlimited clients',
      'Enterprise dispute management',
      '24/7 priority support',
      'Custom templates & workflows',
      'Advanced analytics & reporting',
      'Full API access',
      'Custom branding & white-labeling',
      'Dedicated account manager',
    ],
    popular: false,
  },
];

const testimonials = [
  {
    quote: "This platform has transformed how we handle disputes. It's intuitive and efficient.",
    author: "Sarah Johnson",
    role: "Legal Director, TechCorp",
    rating: 5,
  },
  {
    quote: "The automation features have saved us countless hours. Highly recommended!",
    author: "Michael Chen",
    role: "Operations Manager, Global Solutions",
    rating: 5,
  },
  {
    quote: "The client portal is a game-changer. Our clients love the transparency.",
    author: "Emma Rodriguez",
    role: "CEO, LegalTech Partners",
    rating: 5,
  },
];

const stats = [
  { number: '10,000+', label: 'Disputes Resolved' },
  { number: '500+', label: 'Happy Clients' },
  { number: '95%', label: 'Success Rate' },
  { number: '24/7', label: 'Support Available' },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                  Credexis
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-600 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-indigo-600 block px-3 py-2 text-base font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 block px-3 py-2 text-base font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white block px-3 py-2 rounded-lg text-base font-medium hover:bg-indigo-700 transition-colors mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                Welcome to Credexis
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
            >
              <span className="block">Streamline Your</span>
              <span className="block text-indigo-600">Credit Dispute Management</span>
              <span className="block text-lg sm:text-xl md:text-2xl font-normal text-gray-500 mt-4">
                with Credexis
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
            >
              Credexis is the professional credit repair software for modern businesses. Automate dispute management, 
              maintain FCRA compliance, and provide exceptional client service with our comprehensive platform.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
              role="group"
              aria-label="Get started with Credexis"
            >
              <div className="rounded-md shadow">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  aria-label="Start free trial of Credexis credit dispute management software"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors"
                  aria-label="Sign in to existing Credexis account"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-600" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="stats-heading" className="sr-only">Credexis Platform Statistics</h2>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white">Trusted by Credit Repair Professionals</h3>
            <p className="text-indigo-200 mt-2">See why businesses choose Credexis for their credit dispute management</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white">{stat.number}</div>
                <div className="text-indigo-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50" id="features" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center">
            <h2 id="features-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Complete Credit Dispute Management Features
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Powerful Credexis tools to streamline your workflow and enhance client satisfaction
            </p>
          </header>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                {feature.comingSoon && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    Coming Soon
                  </div>
                )}
                <div className="text-indigo-600 mb-6" aria-hidden="true">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                  {feature.comingSoon && (
                    <span className="ml-2 text-sm text-orange-500 font-medium">(Coming Soon)</span>
                  )}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing" aria-labelledby="pricing-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center">
            <h2 id="pricing-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Credexis Pricing Plans
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Transparent pricing for credit dispute management software that scales with your business
            </p>
          </header>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl border ${
                  plan.popular
                    ? 'border-indigo-500 shadow-lg scale-105'
                    : 'border-gray-200'
                } p-8 flex flex-col bg-white`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-500 mt-4">{plan.description}</p>
                  
                  <ul className="mt-8 space-y-4" role="list">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-600">
                        <Check className="w-5 h-5 text-green-500" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`mt-8 w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  aria-label={`Get started with ${plan.name} plan for $${plan.price} per month`}
                >
                  Get Started
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gray-50" id="about" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <article>
              <h2 id="about-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                About Credexis
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Founded by industry experts with over 20 years of combined experience in credit repair and dispute management, 
                Credexis was built to solve the real challenges faced by credit repair professionals and businesses.
              </p>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Our platform combines cutting-edge technology with deep industry knowledge to provide the most comprehensive 
                credit dispute management solution available. Credexis is committed to helping businesses scale efficiently while maintaining 
                the highest standards of FCRA compliance and client service.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-indigo-600" aria-hidden="true" />
                  <span className="font-semibold text-gray-900">Mission-Driven</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-indigo-600" aria-hidden="true" />
                  <span className="font-semibold text-gray-900">Security First</span>
                </div>
              </div>
            </article>
            <div className="mt-12 lg:mt-0">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-indigo-600">20+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-indigo-600">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-indigo-600">SOC 2</div>
                  <div className="text-gray-600">Compliant</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-3xl font-bold text-indigo-600">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center">
            <h2 id="testimonials-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Customers Say About Credexis
            </h2>
          </header>
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl"
              >
                <div className="flex items-center mb-4" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-600 italic mb-6">"{testimonial.quote}"</blockquote>
                <footer>
                  <cite className="font-semibold text-gray-900 not-italic">{testimonial.author}</cite>
                  <p className="text-gray-500">{testimonial.role}</p>
                </footer>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gray-50" id="contact" aria-labelledby="contact-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <h2 id="contact-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Contact the Credexis Team
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Have questions about Credexis credit dispute management software? We'd love to hear from you.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="space-y-8">
                <address className="flex items-start gap-4 not-italic">
                  <Mail className="w-6 h-6 text-indigo-600 mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Us</h3>
                    <p className="text-gray-600">
                      <a href="mailto:support@credexis.com" className="hover:text-indigo-600 transition-colors">support@credexis.com</a>
                    </p>
                    <p className="text-gray-600">
                      <a href="mailto:sales@credexis.com" className="hover:text-indigo-600 transition-colors">sales@credexis.com</a>
                    </p>
                  </div>
                </address>
                <address className="flex items-start gap-4 not-italic">
                  <Phone className="w-6 h-6 text-indigo-600 mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Call Us</h3>
                    <p className="text-gray-600">
                      <a href="tel:+15551234567" className="hover:text-indigo-600 transition-colors">+1 (555) 123-4567</a>
                    </p>
                    <p className="text-gray-500 text-sm">Monday-Friday, 9am-6pm EST</p>
                  </div>
                </address>
                <address className="flex items-start gap-4 not-italic">
                  <MapPin className="w-6 h-6 text-indigo-600 mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Office</h3>
                    <p className="text-gray-600">123 Business Ave</p>
                    <p className="text-gray-600">Miami, FL 33101</p>
                  </div>
                </address>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <form className="space-y-6" aria-label="Contact form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                  aria-label="Send contact message"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600" aria-labelledby="cta-heading">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 id="cta-heading" className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started with Credexis?</span>
            <span className="block text-indigo-200">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                aria-label="Start free trial of Credexis credit repair software"
              >
                Get started
                <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 