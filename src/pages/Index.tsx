
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { BookOpen, FileText, Upload, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-study-700 to-study-900 py-20 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Your Digital Learning Library
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Access educational materials anytime, anywhere. StudySphere makes learning efficient with 
                our easy-to-use PDF reader platform.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to="/library">
                  <Button size="lg" className="bg-white text-study-700 hover:bg-gray-100">
                    Browse Library
                  </Button>
                </Link>
                <Link to="/upload">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-study-800">
                    Upload Documents
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-80 w-80 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="absolute inset-0 m-auto flex h-64 w-64 items-center justify-center rounded bg-white shadow-lg">
                  <BookOpen className="h-32 w-32 text-study-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Why Choose StudySphere?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Our platform is designed to make educational resources accessible and easy to use
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <FileText className="mb-4 h-10 w-10 text-study-500" />
              <h3 className="mb-2 text-xl font-bold">Easy Document Reading</h3>
              <p className="text-gray-600">
                Our clean, user-friendly interface makes reading PDFs comfortable for extended study sessions
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <Upload className="mb-4 h-10 w-10 text-study-500" />
              <h3 className="mb-2 text-xl font-bold">Simple Upload Process</h3>
              <p className="text-gray-600">
                Share knowledge with easy document uploads - perfect for teachers and content creators
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <Users className="mb-4 h-10 w-10 text-study-500" />
              <h3 className="mb-2 text-xl font-bold">Built For Students</h3>
              <p className="text-gray-600">
                Designed with the needs of students in mind, making study materials readily available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-study-50 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your Learning?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Join StudySphere today and gain access to our growing library of educational materials
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/library">
                <Button size="lg" className="bg-study-600 hover:bg-study-700">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
