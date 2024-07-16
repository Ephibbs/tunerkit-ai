import Link from "next/link";
import { Button } from "./ui/button";

export default function PricingSection() {
  return (
    <div className="w-full max-w-8xl mt-16 mb-16 p-8 rounded-lg space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">Pricing</h2>
      <div className="flex flex-wrap justify-center lg:space-x-4 space-y-4 lg:space-y-0 items-stretch">
        {pricingOptions.map((option, index) => (
          <div
            key={index}
            className={`flex flex-col border rounded-lg p-4 w-full lg:w-64 ${option.bgColor} shadow-md`}
          >
            <div className="flex-grow space-y-2">
              <h3 className="text-xl font-semibold text-center">
                {option.title}
              </h3>
              <p className="text-sm text-gray-600 text-center">
                {option.description}
              </p>
              <p className="font-bold text-center mb-2 py-4">
                {option.price}
              </p>
              <div className="mt-10 text-center pb-4">
                <Link href="/login">
                  {" "}
                  <Button className="w-3/4">{option.buttonText}</Button>
                </Link>
              </div>
              <ul className="space-y-2 mb-4 pl-4">
                {option.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center space-x-2">
                    <span className="text-green-500">✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const pricingOptions = [
  {
    title: "Tiny",
    price: <span className="text-3xl">Free</span>,
    description:
      "Try it out.",
    features: [
      "10k requests / month",
      "Up to 1k users",
    ],
    buttonText: "Get Started",
    bgColor: "bg-white",
  },
  // {
  //   title: "Basic",
  //   price: <span className="text-3xl">$19 <span className="text-sm">/ month</span></span>,
  //   description:
  //     "Perfect for individuals and startups.",
  //   features: [
  //     "1M requests / month",
  //     "Up to 200k users",
  //   ],
  //   buttonText: "Get Started",
  //   bgColor: "border-orange-500 border-2",
  // },
  // {
  //   title: "Advanced",
  //   price: <span className="text-4xl">$199 <span className="text-sm">/ month</span></span>,
  //   description:
  //     "For small businesses and teams.",
  //   features: [
  //     "Unlimited projects",
  //     "300k requests / month",
  //     "Up to 300k users",
  //     "Priority support"
  //   ],
  //   buttonText: "Get Started",
  //   bgColor: "bg-blue-50",
  // },
  {
    title: "Enterprise",
    price: <span className="text-3xl">Contact us</span>,
    description: "For large businesses and teams.",
    features: [
      // "Unlimited projects",
      "Unlimited requests",
      "Unlimited users",
      "Custom features",
      "Fastest support",
    ],
    buttonText: "Choose Enterprise",
    bgColor: "border-orange-500 border-2",
  },
];
