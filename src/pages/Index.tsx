import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isCommunityDiscount, setIsCommunityDiscount] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const categories = [
    {
      id: 1,
      name: "Техническое обслуживание",
      icon: "Wrench",
      services: [
        { id: 1, name: "Замена масла", price: 1500 },
        { id: 2, name: "Замена фильтров", price: 800 },
        { id: 3, name: "Диагностика", price: 1200 },
      ]
    },
    {
      id: 2,
      name: "Ремонт двигателя",
      icon: "Cog",
      services: [
        { id: 4, name: "Ремонт головки блока", price: 15000 },
        { id: 5, name: "Замена поршней", price: 25000 },
        { id: 6, name: "Капитальный ремонт", price: 50000 },
      ]
    },
    {
      id: 3,
      name: "Кузовной ремонт",
      icon: "Car",
      services: [
        { id: 7, name: "Покраска элемента", price: 3000 },
        { id: 8, name: "Рихтовка", price: 2500 },
        { id: 9, name: "Полировка", price: 1800 },
      ]
    },
    {
      id: 4,
      name: "Шиномонтаж",
      icon: "Circle",
      services: [
        { id: 10, name: "Монтаж/демонтаж", price: 400 },
        { id: 11, name: "Балансировка", price: 300 },
        { id: 12, name: "Ремонт камеры", price: 600 },
      ]
    }
  ];

  const allServices = categories.flatMap(cat => cat.services);
  const selectedServicesData = allServices.filter(service => selectedServices.includes(service.id));
  const subtotal = selectedServicesData.reduce((sum, service) => sum + service.price, 0);
  const discount = isCommunityDiscount ? subtotal * 0.15 : 0;
  const total = subtotal - discount;

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Icon name="Calculator" size={28} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">Автосервис Калькулятор</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {!showCalculator ? (
          <>
            {/* Categories Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Категории услуг</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div key={category.id} className="bg-card border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                        <Icon name={category.icon as any} size={24} className="text-primary" />
                      </div>
                      <h3 className="text-sm font-medium text-foreground leading-tight">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.services.length} услуг</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Popular Services */}
              <div className="mt-6">
                <h3 className="text-base font-medium text-foreground mb-3">Популярные услуги</h3>
                <div className="space-y-2">
                  {[
                    { name: "Замена масла", price: 1500, category: "ТО" },
                    { name: "Диагностика", price: 1200, category: "ТО" },
                    { name: "Покраска элемента", price: 3000, category: "Кузов" },
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="Star" size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.category}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {service.price.toLocaleString()} ₽
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Create Order Button */}
            <Button 
              onClick={() => setShowCalculator(true)}
              className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Создать заказ
            </Button>
          </>
        ) : (
          <>
            {/* Calculator */}
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowCalculator(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <h2 className="text-lg font-semibold text-foreground">Калькулятор заказа</h2>
            </div>

            {/* Service Selection */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Выберите услуги</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <Icon name={category.icon as any} size={16} />
                      {category.name}
                    </h4>
                    <div className="space-y-2 ml-6">
                      {category.services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedServices.includes(service.id)}
                              onCheckedChange={() => toggleService(service.id)}
                            />
                            <span className="text-sm text-foreground">{service.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{service.price.toLocaleString()} ₽</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Discount */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isCommunityDiscount}
                    onCheckedChange={setIsCommunityDiscount}
                  />
                  <div>
                    <span className="text-sm text-foreground">Скидка для общинников</span>
                    <p className="text-xs text-muted-foreground">Скидка 15% на все услуги</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total */}
            {selectedServices.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Итого к оплате</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedServicesData.map((service) => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{service.name}</span>
                      <span className="text-foreground">{service.price.toLocaleString()} ₽</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Подытог:</span>
                    <span className="text-foreground">{subtotal.toLocaleString()} ₽</span>
                  </div>
                  
                  {isCommunityDiscount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Скидка общинника (-15%):</span>
                      <span className="text-primary">-{discount.toLocaleString()} ₽</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">К оплате:</span>
                    <span className="text-primary">{total.toLocaleString()} ₽</span>
                  </div>
                  
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Icon name="Check" size={20} className="mr-2" />
                    Оформить заказ
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;