import { useNavigate } from 'react-router-dom';
import TestRunner from '../../components/TestRunner';
import { useContent } from '../../content/ContentProvider';

export default function ScreenTest() {
  const navigate = useNavigate();
  const { testQuestions = [] } = useContent();

  return (
    <TestRunner
      questions={testQuestions}
      kicker="Test Mossos"
      cat="academia"
      timeLabel="47:12"
      streak={23}
      onExit={() => navigate('/academia')}
      emptyMessage="Encara no hi ha preguntes publicades. S'afegiran automàticament quan s'actualitzi el contingut."
    />
  );
}
