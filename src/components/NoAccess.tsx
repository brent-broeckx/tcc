import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NoAccess() {
  return (
    <div className="min-h-[calc(100dvh-4.5rem)] bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-red-950/20 dark:via-pink-950/20 dark:to-purple-950/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-4 left-4 text-6xl">🚫</div>
          <div className="absolute top-8 right-8 text-4xl">🔒</div>
          <div className="absolute bottom-8 left-8 text-5xl">⛔</div>
          <div className="absolute bottom-4 right-4 text-3xl">🚨</div>
        </div>
        
        <CardHeader className="relative z-10">
          {/* Animated bouncing prohibition sign */}
          <div className="text-8xl mb-4 animate-pulse">
            🚫
          </div>
          
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            HALT! Who Goes There?
          </CardTitle>
          
          <div className="text-lg text-muted-foreground">
            🕵️‍♂️ Access Denied, Detective!
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-6">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
              🎭 <strong>Plot Twist!</strong> You've stumbled into the VIP section of our poll app, 
              but it seems you're missing your golden ticket! 🎫
            </p>
          </div>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">👑</span>
              <span>Only admin royalty may pass this digital drawbridge</span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">🔍</span>
              <span>Perhaps you took a wrong turn at the internet?</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-4">
              💡 <em>Pro tip: Try logging in with admin powers, or just enjoy the polls like a normal human! 🤷‍♀️</em>
            </p>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
                className="w-full"
              >
                🏃‍♂️ Retreat
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/polls'} 
                className="w-full"
              >
                🗳️ Go Vote on Some Polls Instead
              </Button>
            </div>
          </div>
          
          {/* Fun footer message */}
          <div className="text-xs text-muted-foreground pt-2 border-t border-dashed border-border">
            <p>🎉 Remember: Even the greatest explorers sometimes hit a wall!</p>
            <p className="mt-1">🌟 Your adventure continues elsewhere...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
