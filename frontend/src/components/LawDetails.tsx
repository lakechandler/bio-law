import { Law } from '@/types/law';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface LawDetailsProps {
  law: Law;
}

export function LawDetails({ law }: LawDetailsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{law.title}</CardTitle>
        <div className="flex gap-2 mt-2">
          {law.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-gray-600">{law.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Content</h3>
            <p className="text-gray-600">{law.content}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Category</h3>
            <p className="text-gray-600">{law.category}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Confidence Score</h3>
            <p className="text-gray-600">{law.confidenceScore}%</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Supporting Papers</h3>
            <ul className="list-disc list-inside text-gray-600">
              {law.supportingPapers.map((paper) => (
                <li key={paper}>{paper}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Contradicting Papers</h3>
            <ul className="list-disc list-inside text-gray-600">
              {law.contradictingPapers.map((paper) => (
                <li key={paper}>{paper}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {format(new Date(law.createdAt), 'PPP')}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{' '}
              {format(new Date(law.updatedAt), 'PPP')}
            </div>
            <div>
              <span className="font-medium">Published:</span>{' '}
              {law.publishedAt ? format(new Date(law.publishedAt), 'PPP') : 'Not published'}
            </div>
            <div>
              <span className="font-medium">Status:</span>{' '}
              <Badge variant={law.status === 'published' ? 'success' : 'secondary'}>
                {law.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 