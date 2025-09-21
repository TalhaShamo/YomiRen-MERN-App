import { Link } from 'react-router-dom';
import { BookOpen, BrainCircuit, Bot, BarChart3 } from 'lucide-react'; // Import icons for our feature cards

const DashboardPage = () => {
  // An array to hold the data for our feature cards, making the code clean and scalable.
  const features = [
    {
      title: 'Text Analyzer',
      description: 'Analyze any Japanese paragraph to find and learn new words.',
      link: '/analyzer',
      icon: <BookOpen size={40} className="text-primary" />,
    },
    {
      title: 'SRS Review',
      description: 'Review your vocabulary with our smart flashcard system.',
      link: '/review',
      icon: <BrainCircuit size={40} className="text-primary" />,
    },
    {
      title: 'AI Tools',
      description: 'Generate new example sentences for your words.',
      link: '/ai-tools',
      icon: <Bot size={40} className="text-primary" />,
    },
  ];

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Choose a tool to continue your learning journey.</p>
      </section>

      {/* Grid container for our feature cards. */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* We map over the features array to render each card. */}
          {features.map((feature) => (
            <Link 
              to={feature.link} 
              key={feature.title}
              className="bg-card p-6 rounded-lg border border-border shadow-sm hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h2 className="text-2xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-muted-foreground">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;