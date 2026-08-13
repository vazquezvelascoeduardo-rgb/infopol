import { useNavigate, useParams } from 'react-router-dom';
import TestRunner from '../../components/TestRunner';
import { useContent } from '../../content/ContentProvider';

export default function ScreenPsicoTest() {
  const navigate = useNavigate();
  const { catId } = useParams();
  const { psicoCategories = [], psicoQuestions = {} } = useContent();

  const category = psicoCategories.find(c => c.id === catId);
  const questions = psicoQuestions[catId] || [];

  return (
    <TestRunner
      questions={questions}
      kicker={category?.title || 'Psicotècnics'}
      cat={category?.cat || 'psico'}
      onExit={() => navigate('/academia/psicotecnics')}
      emptyMessage="Aquesta categoria encara no té preguntes publicades. S'afegiran automàticament quan s'actualitzi el contingut."
    />
  );
}
